import React from 'react';
import { LayoutDashboard, Coins, Building2, Landmark, PieChart, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'overview' | 'crypto' | 'bist' | 'isbank' | 'midas';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Genel Bakış', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'crypto', label: 'Kripto Varlıklar', icon: <Coins className="w-4 h-4" />, badge: 'Otomatik' },
    { id: 'bist', label: 'BIST Hisseleri', icon: <PieChart className="w-4 h-4" /> },
    { id: 'isbank', label: 'İş Bankası Portföyü', icon: <Landmark className="w-4 h-4" />, badge: 'Banka' },
    { id: 'midas', label: 'Midas Portföyü', icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 p-4 min-h-[calc(100vh-57px)]">
      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
        Portföyler
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive
                      ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Şifreli Dosya Depolama</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Portföy verileri 14 turluk bcrypt güvenliği ile SQLite dosyasında (`portfolio.sqlite`) saklanır.
          </p>
        </div>
      </div>
    </aside>
  );
};
