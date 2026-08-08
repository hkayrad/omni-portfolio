import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sun, Moon, LogOut, PlusCircle, Shield, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { liveBtcPrice } = usePortfolio();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-slate-100 dark:text-slate-900 font-bold shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-none">
              OmniPortföy
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
              Tüm Portföyler Tek Ekranda
            </span>
          </div>
        </div>

        {/* Live BTC Status & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Live Binance TR ticker display */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="text-slate-500 dark:text-slate-400">Binance TR BTC:</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">
              ₺{liveBtcPrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-800"
            title="Temayı Değiştir"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Add Asset Modal Button */}
          {isAuthenticated && (
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-slate-100 dark:text-slate-900 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Varlık Ekle</span>
            </button>
          )}

          {/* User Sign Out */}
          {isAuthenticated && (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
              <span className="hidden sm:inline text-xs font-medium text-slate-600 dark:text-slate-400">
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
