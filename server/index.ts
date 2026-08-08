import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getBinanceTrPrice, getBinanceTrUserBalances } from './services/binanceTrService.js';
import { getBybitUserBalances } from './services/bybitService.js';
import { getTefasFundPrice } from './services/tefasService.js';
import { hashPassword, comparePassword, generateToken, verifyToken, UserPayload } from './services/authService.js';
import { db, HoldingRecord } from './services/dbService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 32000;

// Extend Express Request type to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

app.use(cors());
app.use(express.json());

// Authentication Middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication token required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid or expired authentication token' });
  }
}

// Serve React Static Frontend Assets in Production
const clientDistPath = path.resolve(__dirname, '../../dist/client');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// ----------------------------------------------------------------------
// Authentication Routes (bcrypt 14 rounds)
// ----------------------------------------------------------------------

// User Registration
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Username and password (min 6 chars) required' });
    }

    const existingUser = db.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username is already registered' });
    }

    const passwordHash = await hashPassword(password);
    const userId = `u_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    db.createUser({
      id: userId,
      username,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    });

    const token = generateToken({ id: userId, username });

    res.json({
      success: true,
      message: 'Account created successfully',
      data: { token, user: { id: userId, username } },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    const user = db.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const token = generateToken({ id: user.id, username: user.username });

    res.json({
      success: true,
      message: 'Login successful',
      data: { token, user: { id: user.id, username: user.username } },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
});

// ----------------------------------------------------------------------
// Protected Portfolio Routes (Require Authentication)
// ----------------------------------------------------------------------

app.get('/api/holdings', authenticateToken, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const holdings = db.getHoldingsByUserId(userId);
    res.json({ success: true, data: holdings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/holdings', authenticateToken, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id, platform, category, symbol, name, quantity, cost_basis, currency, notes } = req.body;
    const holdingId = id || `h_${Date.now()}`;
    
    const holdingRecord: HoldingRecord = {
      id: holdingId,
      user_id: userId,
      platform,
      category,
      symbol,
      name,
      quantity: parseFloat(quantity) || 0,
      cost_basis: parseFloat(cost_basis) || 0,
      currency: currency || 'TRY',
      notes: notes || '',
      updated_at: new Date().toISOString(),
    };

    db.saveHolding(holdingRecord);
    res.json({ success: true, id: holdingId });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/holdings/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const holdingId = req.params.id as string;
    const success = db.deleteHolding(holdingId, userId);
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------
// Automated Exchange API Sync Routes (Binance TR & Bybit)
// ----------------------------------------------------------------------

app.post('/api/sync/binance-tr', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { apiKey, apiSecret } = req.body;

    const keyToUse = (apiKey && apiKey.trim()) || process.env.BINANCE_TR_API_KEY || process.env.VITE_BINANCE_TR_API_KEY;
    const secretToUse = (apiSecret && apiSecret.trim()) || process.env.BINANCE_TR_API_SECRET || process.env.VITE_BINANCE_TR_API_SECRET;

    if (!keyToUse || !secretToUse) {
      return res.status(400).json({ success: false, error: 'Binance TR API Key and Secret were not found in request or .env' });
    }

    const balances = await getBinanceTrUserBalances(keyToUse, secretToUse);

    const btcPriceObj = await getBinanceTrPrice('BTC_TRY');
    const btcPrice = btcPriceObj.price;

    const syncedCount = balances.length;
    for (const b of balances) {
      let estCost = 1;
      if (b.asset === 'BTC') estCost = btcPrice;
      else if (b.asset === 'TRY') estCost = 1;
      else if (b.asset === 'USDT') estCost = 40.85;

      const holdingRecord: HoldingRecord = {
        id: `binance_tr_${b.asset}_${userId}`,
        user_id: userId,
        platform: 'binance_tr',
        category: b.asset === 'TRY' ? 'fiat' : 'crypto',
        symbol: b.asset,
        name: `Binance TR ${b.asset}`,
        quantity: b.total,
        cost_basis: estCost,
        currency: 'TRY',
        notes: 'Synced automatically via Binance TR API (.env)',
        updated_at: new Date().toISOString(),
      };

      db.saveHolding(holdingRecord);
    }

    const msg = syncedCount > 0
      ? `Successfully synced ${syncedCount} asset balances from Binance TR`
      : 'Binance TR API connected successfully! Note: The API reported 0 non-zero spot balances for this account.';

    res.json({
      success: true,
      message: msg,
      data: balances,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/sync/bybit', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { apiKey, apiSecret } = req.body;

    const keyToUse = (apiKey && apiKey.trim()) || process.env.BYBIT_API_KEY || process.env.VITE_BYBIT_API_KEY;
    const secretToUse = (apiSecret && apiSecret.trim()) || process.env.BYBIT_API_SECRET || process.env.VITE_BYBIT_API_SECRET;

    const balances = await getBybitUserBalances(keyToUse, secretToUse);
    const syncedCount = balances.length;

    for (const b of balances) {
      const holdingRecord: HoldingRecord = {
        id: `bybit_${b.coin}_${userId}`,
        user_id: userId,
        platform: 'bybit',
        category: 'crypto',
        symbol: b.coin,
        name: `Bybit ${b.coin}`,
        quantity: b.equity,
        cost_basis: b.coin === 'USDT' ? 40.85 : 1,
        currency: 'TRY',
        notes: 'Synced automatically via Bybit V5 API',
        updated_at: new Date().toISOString(),
      };

      db.saveHolding(holdingRecord);
    }

    res.json({
      success: true,
      message: `Successfully synced ${syncedCount} asset balances from Bybit`,
      data: balances,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Binance TR Live Market Price Route Endpoint
app.get('/api/market/binance-tr', async (req: Request, res: Response) => {
  try {
    const symbol = (req.query.symbol as string) || 'BTC_TRY';
    const priceData = await getBinanceTrPrice(symbol);
    res.json({ success: true, data: priceData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Live Forex Rates (USD/TRY & EUR/TRY) Endpoint
app.get('/api/market/forex', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    const tryRate = data.rates?.TRY || 47.70;
    const eurRateUSD = data.rates?.EUR || 0.865;
    const eurTryRate = eurRateUSD > 0 ? tryRate / eurRateUSD : 55.10;

    res.json({
      success: true,
      data: {
        usdTry: tryRate,
        eurTry: eurTryRate,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.json({
      success: true,
      data: {
        usdTry: 47.70,
        eurTry: 55.10,
        updated_at: new Date().toISOString(),
      },
    });
  }
});

// Live TEFAS Fund Price Endpoint
app.get('/api/market/tefas', async (req: Request, res: Response) => {
  try {
    const symbol = (req.query.symbol as string) || 'TCD';
    const fundData = await getTefasFundPrice(symbol);
    res.json({ success: true, data: fundData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// SPA Fallback Routing for React Frontend
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('API Node.js Server Running. Build the client app to serve frontend.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js Portfolio Server with bcrypt (14 rounds) listening on port ${PORT}`);
});
