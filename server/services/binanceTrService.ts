import axios from 'axios';
import crypto from 'crypto';

export interface BinanceTrTicker {
  symbol: string;
  bidPrice: number;
  askPrice: number;
  price: number;
}

export interface BinanceTrAssetBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

/**
 * Fetch live ticker price for a symbol directly from Binance TR REST API
 * @param symbol Symbol format e.g. "BTC_TRY", "ETH_TRY", "USDT_TRY"
 */
export async function getBinanceTrPrice(symbol: string = 'BTC_TRY'): Promise<BinanceTrTicker> {
  const formattedSymbol = symbol.toUpperCase().includes('_') 
    ? symbol.toUpperCase() 
    : `${symbol.toUpperCase()}_TRY`;

  const url = `https://www.binance.tr/open/v1/market/depth?symbol=${formattedSymbol}&limit=5`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PortfolioTracker/1.0',
      },
      timeout: 5000,
    });

    if (response.data && response.data.code === 0 && response.data.data) {
      const bids = response.data.data.bids;
      const asks = response.data.data.asks;

      const topBid = bids && bids.length > 0 ? parseFloat(bids[0][0]) : 0;
      const topAsk = asks && asks.length > 0 ? parseFloat(asks[0][0]) : 0;
      const midPrice = topBid && topAsk ? (topBid + topAsk) / 2 : topBid || topAsk;

      return {
        symbol: formattedSymbol,
        bidPrice: topBid,
        askPrice: topAsk,
        price: midPrice,
      };
    }

    throw new Error(response.data?.msg || 'Failed to fetch price from Binance TR');
  } catch (error: any) {
    console.error(`Error fetching ${formattedSymbol} from Binance TR:`, error.message);
    throw error;
  }
}

/**
 * Synchronize user spot wallet balances from Binance TR using API Key and Secret
 */
export async function getBinanceTrUserBalances(apiKey: string, apiSecret: string): Promise<BinanceTrAssetBalance[]> {
  const timestamp = Date.now();
  const queryString = `timestamp=${timestamp}`;

  // Generate HMAC SHA256 signature
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(queryString)
    .digest('hex');

  const url = `https://www.binance.tr/open/v1/account/spot?${queryString}&signature=${signature}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-MBX-APIKEY': apiKey,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PortfolioTracker/1.0',
      },
      timeout: 10000,
    });

    if (response.data && response.data.code === 0 && response.data.data) {
      const balances = response.data.data.balances || [];
      const nonZeroAssets: BinanceTrAssetBalance[] = [];

      for (const item of balances) {
        const free = parseFloat(item.free) || 0;
        const locked = parseFloat(item.locked) || 0;
        const total = free + locked;

        if (total > 0.00001) {
          nonZeroAssets.push({
            asset: item.asset,
            free,
            locked,
            total,
          });
        }
      }

      return nonZeroAssets;
    }

    throw new Error(response.data?.msg || 'Failed to authenticate or fetch account balances from Binance TR');
  } catch (error: any) {
    console.error('Binance TR Account Sync Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || error.message || 'Binance TR account sync failed');
  }
}
