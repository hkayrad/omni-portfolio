import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PortfolioSummary } from '../../types/portfolio';

interface AllocationProps {
  summary: PortfolioSummary;
}

const COLORS = ['#10b981', '#64748b', '#f59e0b', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const isNoAssets = data.name === 'No Assets Registered' || data.name === 'KAYITLI VARLIK YOK';
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs font-mono">
        <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{data.name}</p>
        <p className="text-slate-600 dark:text-slate-400">
          {isNoAssets
            ? '0 Pozisyon'
            : `₺${Number(data.value).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </p>
      </div>
    );
  }
  return null;
};

export const AssetAllocationChart: React.FC<AllocationProps> = ({ summary }) => {
  const categoryData = Object.entries(summary.categoryAllocation)
    .filter(([_, val]) => val > 0)
    .map(([key, val]) => {
      let label = key.toUpperCase();
      if (key === 'bist') label = 'BIST Hisseleri';
      else if (key === 'crypto') label = 'Kripto Paralar';
      else if (key === 'tefas') label = 'TEFAS Fonları';
      else if (key === 'fiat') label = 'Döviz & Nakit';
      else if (key === 'gold') label = 'Altın & Maden';
      return { name: label, value: val };
    });

  const displayData = categoryData.length > 0 ? categoryData : [{ name: 'Kayıtlı Varlık Yok', value: 1 }];

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
        Varlık Dağılımı
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Varlık sınıfı ve platform bazında kırılım
      </p>

      <div className="w-full h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {displayData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
