import React from 'react';
import { AssetTable } from '../dashboard/AssetTable';
import { TradingViewWidget } from '../charts/TradingViewWidget';
import { Landmark, Info } from 'lucide-react';

export const IsBankCard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Landmark className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">İş Bankası Portföyü</h2>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              Banka Hesabı
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            BIST Hisseleri (`GARAN`, `AKBNK`), TEFAS Fonları (`TCD`, `AFA`), Gram Altın ve Döviz Mevduat Takibi
          </p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs flex items-center gap-3">
        <Info className="w-5 h-5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
        <span>
          BDDK ve TCMB bankacılık güvenlik mevzuatı gereği doğrudan banka hesabı çekimi kısıtlıdır. Aşağıdan Hisse Kodu, TEFAS Fon Kodu veya Döviz miktarınızı girerek TEFAS ve BIST canlı veri akışından anlık değerleme alabilirsiniz.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingViewWidget symbol="BIST:XU100" />
        </div>
        <div className="lg:col-span-1 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
            Desteklenen Varlık Türleri
          </h3>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
              <span>BIST Hisseleri:</span>
              <span className="text-slate-900 dark:text-slate-200 font-mono">BIST Canlı Fiyatlar</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
              <span>TEFAS Fonları:</span>
              <span className="text-slate-900 dark:text-slate-200 font-mono">TEFAS Takasbank NAV</span>
            </li>
            <li className="flex justify-between">
              <span>Altın & Döviz:</span>
              <span className="text-slate-900 dark:text-slate-200 font-mono">TCMB Kurları</span>
            </li>
          </ul>
        </div>
      </div>

      <AssetTable platformFilter="isbank" />
    </div>
  );
};
