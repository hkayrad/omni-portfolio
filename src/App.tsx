import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MetricCards } from './components/dashboard/MetricCard';
import { AssetAllocationChart } from './components/dashboard/AssetAllocationChart';
import { LightweightLineChart } from './components/charts/LightweightLineChart';
import { AssetTable } from './components/dashboard/AssetTable';
import { BinanceTrCard } from './components/platform/BinanceTrCard';
import { BybitCard } from './components/platform/BybitCard';
import { IsBankCard } from './components/platform/IsBankCard';
import { MidasCard } from './components/platform/MidasCard';
import { AddHoldingModal } from './components/modals/AddHoldingModal';
import { AuthForm } from './components/auth/AuthForm';
import { usePortfolio } from './context/PortfolioContext';

const DashboardContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { summary } = usePortfolio();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Şifreli dosya veritabanı yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-20 lg:pb-8 transition-colors">
      <Header onOpenAddModal={() => setIsAddModalOpen(true)} />

      <div className="max-w-7xl mx-auto flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-hidden">
          {activeTab === 'overview' && (
            <>
              <MetricCards summary={summary} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                        Net Varlık Büyüme Geçmişi (TRY)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        TradingView Canvas motoru ile zaman içindeki portföy grafikleşimi
                      </p>
                    </div>
                  </div>
                  <LightweightLineChart currentTotalValue={summary.totalValueTRY} />
                </div>

                <div className="lg:col-span-1">
                  <AssetAllocationChart summary={summary} />
                </div>
              </div>

              <AssetTable />
            </>
          )}

          {activeTab === 'crypto' && <BinanceTrCard />}
          {activeTab === 'isbank' && <IsBankCard />}
          {activeTab === 'midas' && <MidasCard />}
          {activeTab === 'bist' && <IsBankCard />}
        </main>
      </div>

      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <AddHoldingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <DashboardContent />
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
