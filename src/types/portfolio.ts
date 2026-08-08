export type PlatformType = 'binance_tr' | 'bybit' | 'isbank' | 'midas';
export type AssetCategory = 'bist' | 'crypto' | 'tefas' | 'fiat' | 'gold';
export type CurrencyCode = 'TRY' | 'USD' | 'EUR';

export interface User {
  id: string;
  username: string;
}

export interface Holding {
  id: string;
  user_id: string;
  platform: PlatformType;
  category: AssetCategory;
  symbol: string;
  name: string;
  quantity: number;
  cost_basis: number;
  currency: CurrencyCode;
  notes?: string;
  current_price?: number;
  change_24h?: number;
  total_value?: number;
  total_pnl?: number;
  pnl_percentage?: number;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  holding_id?: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAWAL';
  platform: PlatformType;
  symbol: string;
  amount: number;
  unit_price: number;
  fee?: number;
  transaction_date: string;
}

export interface MarketPrice {
  symbol: string;
  price: number;
  change_24h: number;
  bidPrice?: number;
  askPrice?: number;
  updated_at: string;
}

export interface PortfolioSummary {
  totalValueTRY: number;
  totalValueUSD: number;
  totalValueEUR: number;
  totalCostBasisTRY: number;
  totalPnLTRY: number;
  totalPnLEUR: number;
  totalPnLPercentage: number;
  dailyChangeTRY: number;
  dailyChangePercentage: number;
  categoryAllocation: Record<AssetCategory, number>;
  platformAllocation: Record<PlatformType, number>;
}
