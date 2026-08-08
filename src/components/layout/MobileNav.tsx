import React from 'react';
import { LayoutDashboard, Coins, Landmark, Building2, PlusCircle } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface MobileNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, onOpenAddModal }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Özet', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'crypto', label: 'Kripto', icon: <Coins className="w-5 h-5" /> },
    { id: 'isbank', label: 'İşbank', icon: <Landmark className="w-5 h-5" /> },
    { id: 'midas', label: 'Midas', icon: <Building2 className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                isActive
                  ? 'text-slate-900 dark:text-slate-100 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenAddModal}
          className="flex flex-col items-center gap-1 py-1 px-3 text-slate-900 dark:text-slate-100 hover:opacity-80 transition-opacity"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Ekle</span>
        </button>
      </div>
    </div>
  );
};
