import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine database path supporting environment variables for Docker volume mounts
const envDbPath = process.env.DB_FILE_PATH;
const dbFilePath = envDbPath
  ? path.resolve(envDbPath.endsWith('.sqlite') ? envDbPath.replace('.sqlite', '.json') : envDbPath)
  : path.join(path.resolve(__dirname, '../../db'), 'portfolio.json');

const dbDir = path.dirname(dbFilePath);

export interface UserRecord {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface HoldingRecord {
  id: string;
  user_id: string;
  platform: string;
  category: string;
  symbol: string;
  name: string;
  quantity: number;
  cost_basis: number;
  currency: string;
  notes?: string;
  updated_at: string;
}

export interface DBData {
  users: UserRecord[];
  holdings: HoldingRecord[];
}

class FileDatabase {
  private data: DBData = { users: [], holdings: [] };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      if (fs.existsSync(dbFilePath)) {
        const fileContent = fs.readFileSync(dbFilePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = {
          users: Array.isArray(parsed.users) ? parsed.users : [],
          holdings: Array.isArray(parsed.holdings) ? parsed.holdings : [],
        };
      } else {
        this.save();
      }
    } catch (err) {
      console.error(`Database Init Error for ${dbFilePath}:`, err);
      this.data = { users: [], holdings: [] };
    }
  }

  private save() {
    try {
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Database Save Error for ${dbFilePath}:`, err);
    }
  }

  // User queries
  public findUserByUsername(username: string): UserRecord | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  public createUser(user: UserRecord): void {
    this.data.users.push(user);
    this.save();
  }

  // Holding queries
  public getHoldingsByUserId(userId: string): HoldingRecord[] {
    return this.data.holdings.filter((h) => h.user_id === userId);
  }

  public saveHolding(holding: HoldingRecord): void {
    const index = this.data.holdings.findIndex((h) => h.id === holding.id && h.user_id === holding.user_id);
    if (index >= 0) {
      this.data.holdings[index] = holding;
    } else {
      this.data.holdings.push(holding);
    }
    this.save();
  }

  public deleteHolding(id: string, userId: string): boolean {
    const initialLen = this.data.holdings.length;
    this.data.holdings = this.data.holdings.filter((h) => !(h.id === id && h.user_id === userId));
    if (this.data.holdings.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
}

export const db = new FileDatabase();
