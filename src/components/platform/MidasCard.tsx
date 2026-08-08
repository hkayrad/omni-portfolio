import React from 'react';
import { AssetTable } from '../dashboard/AssetTable';
import { TradingViewWidget } from '../charts/TradingViewWidget';
import { Building2, Info } from 'lucide-react';

export const MidasCard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Midas Yatırım Portföyü</h2>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              BIST & Amerikan Hisseleri
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Türk Hisseleri (`THYAO`, `EREGL`) ve Amerikan Hisseleri (`AAPL`, `NVDA`) Otomatik Değerleme
          </p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs flex items-center gap-3">
        <Info className="w-5 h-5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
        <span>
          Midas geliştirici API desteği sunmadığından, Hisse Sembolünüzü ve Alış Fiyatınızı girerek TradingView ve BIST piyasa akışıyla canlı portföy değerleme takibi yapabilirsiniz.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingViewWidget symbol="BIST:THYAO" />
        </div>
        <div className="lg:col-span-1 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
            Desteklenen Varlık Türleri
          </h3>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 font-mono">
            <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
              <span>BIST Hisseleri:</span>
              <span className="text-slate-900 dark:text-slate-200 font-semibold">THYAO, EREGL, SISE</span>
            </li>
            <li className="flex justify-between">
              <span>ABD Hisseleri:</span>
              <span className="text-slate-900 dark:text-slate-200 font-semibold">AAPL, NVDA, TSLA</span>
            </li>
          </ul>
        </div>
      </div>

      <AssetTable platformFilter="midas" />
    </div>
  );
};
