import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { X, Key, Check, AlertCircle, FileCode } from 'lucide-react';
import { PlatformType } from '../../types/portfolio';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlatform?: PlatformType;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  defaultPlatform = 'binance_tr',
}) => {
  const { token } = useAuth();
  const { refreshHoldings } = usePortfolio();

  const [platform, setPlatform] = useState<PlatformType>(defaultPlatform);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const endpoint = platform === 'bybit' ? '/api/sync/bybit' : '/api/sync/binance-tr';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ apiKey: apiKey.trim(), apiSecret: apiSecret.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || 'Hesap varlıkları başarıyla senkronize edildi!');
        await refreshHoldings();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data.error || 'Borsa senkronizasyonu başarısız oldu');
      }
    } catch (err: any) {
      setError('API senkronizasyonu sırasında bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Key className="w-6 h-6 text-slate-900 dark:text-slate-100" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Borsa API Anahtarı Bağla
          </h2>
        </div>

        <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Anahtarınız <code>.env</code> dosyasında tanımlıysa alanları boş bırakıp <b>Hesabı Senkronize Et</b> butonuna tıklayabilirsiniz.</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSync} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Borsa Platformu
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformType)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 font-semibold"
            >
              <option value="binance_tr">Binance TR (`binance.tr`)</option>
              <option value="bybit">Bybit (V5 REST API)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              API Key (.env tanımlıysa isteğe bağlı)
            </label>
            <input
              type="text"
              placeholder=".env anahtarlarını kullanmak için boş bırakın"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              API Secret (.env tanımlıysa isteğe bağlı)
            </label>
            <input
              type="password"
              placeholder=".env anahtarlarını kullanmak için boş bırakın"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono text-xs"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-slate-100 dark:text-slate-900 font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Senkronize Ediliyor...' : 'Hesabı Senkronize Et'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
