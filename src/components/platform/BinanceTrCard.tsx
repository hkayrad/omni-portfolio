import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AssetTable } from '../dashboard/AssetTable';
import { TradingViewWidget } from '../charts/TradingViewWidget';
import { ApiKeyModal } from '../modals/ApiKeyModal';
import { Coins, Zap, Key } from 'lucide-react';

export const BinanceTrCard: React.FC = () => {
  const { liveBtcPrice } = usePortfolio();
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Binance TR Account Sync</h2>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              Automated API Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Direct REST integration with Binance TR (`binance.tr`)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsApiModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-slate-100 dark:text-slate-900 text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Key className="w-4 h-4" />
            <span>Connect API Keys</span>
          </button>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Binance TR BTC/TRY:</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                ₺{liveBtcPrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Chart & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingViewWidget symbol="BINANCE:BTCUSDT" />
        </div>
        <div className="lg:col-span-1 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
              Binance TR Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter your Binance TR API Key & Secret to sync your spot wallet balances directly into your portfolio.
            </p>
          </div>
          <button
            onClick={() => setIsApiModalOpen(true)}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Key className="w-4 h-4" />
            <span>Sync Account Balances</span>
          </button>
        </div>
      </div>

      {/* Assets Table */}
      <AssetTable platformFilter="binance_tr" />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        defaultPlatform="binance_tr"
      />
    </div>
  );
};
