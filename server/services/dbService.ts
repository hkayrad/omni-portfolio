import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.resolve(__dirname, '../../db');
const dbFilePath = path.join(dbDir, 'portfolio.json');

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
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    if (fs.existsSync(dbFilePath)) {
      try {
        const fileContent = fs.readFileSync(dbFilePath, 'utf-8');
        this.data = JSON.parse(fileContent);
        if (!this.data.users) this.data.users = [];
        if (!this.data.holdings) this.data.holdings = [];
      } catch (err) {
        console.error('Failed to parse db file, initializing fresh database:', err);
        this.save();
      }
    } else {
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save to db file:', err);
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
