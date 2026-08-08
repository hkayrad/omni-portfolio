import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Holding, PortfolioSummary, PlatformType, AssetCategory } from '../types/portfolio';
import { useAuth } from './AuthContext';

interface PortfolioContextType {
  holdings: Holding[];
  loading: boolean;
  error: string | null;
  summary: PortfolioSummary;
  refreshHoldings: () => Promise<void>;
  addHolding: (holding: Partial<Holding>) => Promise<boolean>;
  deleteHolding: (id: string) => Promise<boolean>;
  liveBtcPrice: number;
  eurTryRate: number;
  usdTryRate: number;
}

const defaultSummary: PortfolioSummary = {
  totalValueTRY: 0,
  totalValueUSD: 0,
  totalValueEUR: 0,
  totalCostBasisTRY: 0,
  totalPnLTRY: 0,
  totalPnLEUR: 0,
  totalPnLPercentage: 0,
  dailyChangeTRY: 0,
  dailyChangePercentage: 0,
  categoryAllocation: { bist: 0, crypto: 0, tefas: 0, fiat: 0, gold: 0 },
  platformAllocation: { binance_tr: 0, bybit: 0, isbank: 0, midas: 0 },
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [rawHoldings, setRawHoldings] = useState<Holding[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [liveBtcPrice, setLiveBtcPrice] = useState<number>(3096000);
  const [usdTryRate, setUsdTryRate] = useState<number>(47.70);
  const [eurTryRate, setEurTryRate] = useState<number>(55.116);
  const [tefasPrices, setTefasPrices] = useState<Record<string, number>>({});

  const [summary, setSummary] = useState<PortfolioSummary>(defaultSummary);

  // Fetch Live Forex rates
  const fetchForexRates = useCallback(async () => {
    try {
      const res = await fetch('/api/market/forex');
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.usdTry) setUsdTryRate(json.data.usdTry);
        if (json.data.eurTry) setEurTryRate(json.data.eurTry);
      }
    } catch (err) {
      console.error('Forex Rate Sync Error:', err);
    }
  }, []);

  // Fetch Live BTC/TRY price directly from Binance TR endpoint
  const fetchBinanceTrBtcPrice = useCallback(async () => {
    try {
      const res = await fetch('/api/market/binance-tr?symbol=BTC_TRY');
      const json = await res.json();
      if (json.success && json.data && json.data.price) {
        setLiveBtcPrice(json.data.price);
      }
    } catch (err) {
      console.error('Binance TR Price Sync Error:', err);
    }
  }, []);

  // Fetch Live TEFAS fund prices ONLY for items in category 'tefas'
  const fetchTefasPrices = useCallback(async (items: Holding[]) => {
    const tefasItems = items.filter((i) => i.category === 'tefas');

    for (const item of tefasItems) {
      const sym = item.symbol.toUpperCase();
      try {
        const res = await fetch(`/api/market/tefas?symbol=${sym}`);
        const json = await res.json();
        if (json.success && json.data && json.data.price) {
          setTefasPrices((prev) => ({ ...prev, [sym]: json.data.price }));
        }
      } catch (err) {
        console.error(`TEFAS Sync Error for ${sym}:`, err);
      }
    }
  }, []);

  const calculateSummary = useCallback(
    (items: Holding[], btcPrice: number, usdRate: number, eurRate: number, tefasMap: Record<string, number>) => {
      let totalValueTRY = 0;
      let totalCostBasisTRY = 0;

      const catAlloc: Record<AssetCategory, number> = { bist: 0, crypto: 0, tefas: 0, fiat: 0, gold: 0 };
      const platAlloc: Record<PlatformType, number> = { binance_tr: 0, bybit: 0, isbank: 0, midas: 0 };

      const processedHoldings = items.map((h) => {
        const sym = h.symbol.toUpperCase();
        let unitPriceInTRY = h.cost_basis;
        let totalCostTRY = h.quantity * h.cost_basis;

        // Handle TEFAS Mutual Funds
        if (h.category === 'tefas' || tefasMap[sym]) {
          unitPriceInTRY = tefasMap[sym] || h.cost_basis;
          totalCostTRY = h.quantity * h.cost_basis;
        }
        // Handle Fiat Currency Holdings (EUR, USD)
        else if (sym === 'EUR' || (h.category === 'fiat' && sym.includes('EUR'))) {
          unitPriceInTRY = eurRate;
          totalCostTRY = h.quantity * h.cost_basis;
        } else if (sym === 'USD' || (h.category === 'fiat' && sym.includes('USD'))) {
          unitPriceInTRY = usdRate;
          totalCostTRY = h.quantity * h.cost_basis;
        } else if (h.category === 'crypto' && sym.includes('BTC')) {
          unitPriceInTRY = btcPrice > 0 ? btcPrice : h.cost_basis;
        } else {
          // Other foreign assets (stocks/funds in USD or EUR)
          let currencyMultiplier = 1;
          if (h.currency === 'USD') currencyMultiplier = usdRate;
          else if (h.currency === 'EUR') currencyMultiplier = eurRate;

          unitPriceInTRY = h.cost_basis * currencyMultiplier;
          totalCostTRY = h.quantity * h.cost_basis * currencyMultiplier;
        }

        const totalValTRY = h.quantity * unitPriceInTRY;
        const pnlTRY = totalValTRY - totalCostTRY;
        const pnlPercent = totalCostTRY > 0 ? (pnlTRY / totalCostTRY) * 100 : 0;

        totalValueTRY += totalValTRY;
        totalCostBasisTRY += totalCostTRY;

        catAlloc[h.category] = (catAlloc[h.category] || 0) + totalValTRY;
        platAlloc[h.platform] = (platAlloc[h.platform] || 0) + totalValTRY;

        return {
          ...h,
          current_price: unitPriceInTRY,
          total_value: totalValTRY,
          total_pnl: pnlTRY,
          pnl_percentage: pnlPercent,
        };
      });

      const totalPnLTRY = totalValueTRY - totalCostBasisTRY;
      const totalPnLPercentage = totalCostBasisTRY > 0 ? (totalPnLTRY / totalCostBasisTRY) * 100 : 0;

      const totalValueUSD = usdRate > 0 ? totalValueTRY / usdRate : 0;
      const totalValueEUR = eurRate > 0 ? totalValueTRY / eurRate : 0;
      const totalPnLEUR = eurRate > 0 ? totalPnLTRY / eurRate : 0;

      setSummary({
        totalValueTRY,
        totalValueUSD,
        totalValueEUR,
        totalCostBasisTRY,
        totalPnLTRY,
        totalPnLEUR,
        totalPnLPercentage,
        dailyChangeTRY: totalValueTRY > 0 ? totalValueTRY * 0.012 : 0,
        dailyChangePercentage: totalValueTRY > 0 ? 1.2 : 0,
        categoryAllocation: catAlloc,
        platformAllocation: platAlloc,
      });

      setHoldings(processedHoldings);
    },
    []
  );

  // Recalculate summary whenever rawHoldings or tefasPrices update
  useEffect(() => {
    if (rawHoldings.length > 0) {
      calculateSummary(rawHoldings, liveBtcPrice, usdTryRate, eurTryRate, tefasPrices);
    }
  }, [rawHoldings, liveBtcPrice, usdTryRate, eurTryRate, tefasPrices, calculateSummary]);

  const refreshHoldings = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setRawHoldings([]);
      setHoldings([]);
      setSummary(defaultSummary);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/holdings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setRawHoldings(data.data);
        calculateSummary(data.data, liveBtcPrice, usdTryRate, eurTryRate, tefasPrices);
        fetchTefasPrices(data.data);
      } else {
        setError(data.error || 'Failed to fetch holdings');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching holdings');
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, calculateSummary, liveBtcPrice, usdTryRate, eurTryRate, tefasPrices, fetchTefasPrices]);

  useEffect(() => {
    fetchBinanceTrBtcPrice();
    fetchForexRates();
    const interval = setInterval(() => {
      fetchBinanceTrBtcPrice();
      fetchForexRates();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchBinanceTrBtcPrice, fetchForexRates]);

  useEffect(() => {
    refreshHoldings();
  }, [token, isAuthenticated]);

  const addHolding = async (newHolding: Partial<Holding>): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/holdings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHolding),
      });
      const data = await res.json();
      if (data.success) {
        await refreshHoldings();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding holding:', err);
      return false;
    }
  };

  const deleteHolding = async (id: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/holdings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        await refreshHoldings();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting holding:', err);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        holdings,
        loading,
        error,
        summary,
        refreshHoldings,
        addHolding,
        deleteHolding,
        liveBtcPrice,
        eurTryRate,
        usdTryRate,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
