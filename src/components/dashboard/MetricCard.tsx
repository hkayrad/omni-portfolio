import React from 'react';
import { TrendingUp, TrendingDown, Wallet, DollarSign, Euro, PieChart } from 'lucide-react';
import { PortfolioSummary } from '../../types/portfolio';

interface MetricCardsProps {
  summary: PortfolioSummary;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  const isProfit = summary.totalPnLTRY >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Net Worth (TRY) */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Toplam Net Varlık (TRY)
          </span>
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-mono">
          ₺{summary.totalValueTRY.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          Maliyet: ₺{summary.totalCostBasisTRY.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
        </div>
      </div>

      {/* Equivalent (USD & EUR) */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            USD / EUR Karşılığı
          </span>
          <div className="flex gap-1">
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
              <Euro className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-slate-50 font-mono">
          ${summary.totalValueUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-400 font-mono">
          €{summary.totalValueEUR.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Total Return (P&L in TRY & EUR) */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Kar / Zarar (TRY ve EUR)
          </span>
          <div className={`p-2 rounded-xl ${isProfit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div className={`text-xl font-bold font-mono ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
          {isProfit ? '+' : ''}₺{summary.totalPnLTRY.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`mt-0.5 text-xs font-mono font-semibold ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {isProfit ? '+' : ''}€{summary.totalPnLEUR.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Platforms Connected */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Aktif Hesaplar
          </span>
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-mono">
          4 Uygulama
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Binance TR, Bybit, İşbank, Midas</span>
        </div>
      </div>
    </div>
  );
};
