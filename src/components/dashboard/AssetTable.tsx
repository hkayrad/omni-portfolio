import React, { useState } from 'react';
import { Holding, PlatformType, AssetCategory } from '../../types/portfolio';
import { usePortfolio } from '../../context/PortfolioContext';
import { Trash2, TrendingUp, TrendingDown, Search } from 'lucide-react';

interface AssetTableProps {
  platformFilter?: PlatformType;
  categoryFilter?: AssetCategory;
}

export const AssetTable: React.FC<AssetTableProps> = ({ platformFilter, categoryFilter }) => {
  const { holdings, deleteHolding } = usePortfolio();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>(categoryFilter || 'ALL');

  const filteredHoldings = holdings.filter((item) => {
    if (platformFilter && item.platform !== platformFilter) return false;
    if (selectedCat !== 'ALL' && item.category !== selectedCat) return false;
    if (
      search &&
      !item.symbol.toLowerCase().includes(search.toLowerCase()) &&
      !item.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getPlatformBadge = (plat: PlatformType) => {
    switch (plat) {
      case 'binance_tr':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">Binance TR</span>;
      case 'bybit':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">Bybit</span>;
      case 'isbank':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">İş Bankası</span>;
      case 'midas':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">Midas</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Varlık Portföyü ve Pozisyonlar
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            BIST, Kripto ve Banka uygulamalarında canlı değerleme
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Varlık veya sembol ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Category Filter */}
          {!categoryFilter && (
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="ALL">Tüm Kategoriler</option>
              <option value="bist">BIST Hisseleri</option>
              <option value="crypto">Kripto Paralar</option>
              <option value="tefas">TEFAS Fonları</option>
              <option value="fiat">Döviz ve Nakit</option>
              <option value="gold">Altın ve Madenler</option>
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              <th className="pb-3 px-2">Varlık</th>
              <th className="pb-3 px-2">Platform</th>
              <th className="pb-3 px-2 text-right">Miktar</th>
              <th className="pb-3 px-2 text-right">Ort. Maliyet</th>
              <th className="pb-3 px-2 text-right">Güncel Fiyat</th>
              <th className="pb-3 px-2 text-right">Toplam Değer (TRY)</th>
              <th className="pb-3 px-2 text-right">Kar / Zarar</th>
              <th className="pb-3 px-2 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {filteredHoldings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                  Henüz kayıtlı varlık pozisyonu bulunamadı. İlk varlığınızı eklemek için 'Varlık Ekle' butonuna tıklayın.
                </td>
              </tr>
            ) : (
              filteredHoldings.map((item) => {
                const isGain = (item.total_pnl || 0) >= 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-2 font-sans font-semibold text-slate-900 dark:text-slate-100">
                      <div className="flex flex-col">
                        <span>{item.symbol}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-sans">{getPlatformBadge(item.platform)}</td>
                    <td className="py-3 px-2 text-right text-slate-700 dark:text-slate-300">
                      {item.quantity.toLocaleString('tr-TR', { maximumFractionDigits: 4 })}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-500 dark:text-slate-400">
                      ₺{item.cost_basis.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-slate-900 dark:text-slate-100">
                      ₺{(item.current_price || item.cost_basis).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-slate-900 dark:text-slate-100">
                      ₺{(item.total_value || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-2 text-right font-semibold ${isGain ? 'text-emerald-500' : 'text-red-500'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {isGain ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>
                          {isGain ? '+' : ''}₺{(item.total_pnl || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] font-sans">
                          ({isGain ? '+' : ''}{(item.pnl_percentage || 0).toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => deleteHolding(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Varlığı sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
