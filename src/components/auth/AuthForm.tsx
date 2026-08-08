import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, User as UserIcon, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success && data.data?.token && data.data?.user) {
        login(data.data.token, data.data.user);
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || 'Kimlik doğrulama başarısız');
      }
    } catch (err: any) {
      setError('Bağlantı hatası, lütfen tekrar deneyin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 mb-4">
          <ShieldCheck className="w-6 h-6 text-slate-900 dark:text-slate-100" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {isRegister ? 'Yeni Hesap Oluştur' : 'Tekrar Hoş Geldiniz'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isRegister
            ? '14 turluk bcrypt şifrelemesi ile güvenli kayıt'
            : 'Tüm yatırım portföylerinize tek ekrandan erişin'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Kullanıcı Adı
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="örneğin: investor_tr"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Şifre
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-slate-100 dark:text-slate-900 font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? (
            <span>Giriş Yapılıyor...</span>
          ) : (
            <>
              <span>{isRegister ? 'Hesabı Oluştur' : 'Giriş Yap'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        {isRegister ? 'Zaten hesabınız var mı?' : 'Henüz bir hesabınız yok mu?'}{' '}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
          className="text-slate-900 dark:text-slate-100 hover:underline font-semibold"
        >
          {isRegister ? 'Giriş Yap' : 'Hemen Kayıt Ol'}
        </button>
      </div>
    </div>
  );
};
