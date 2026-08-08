import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PlatformType, AssetCategory, CurrencyCode } from '../../types/portfolio';
import { X, PlusCircle, Check } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddHoldingModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addHolding } = usePortfolio();

  const [platform, setPlatform] = useState<PlatformType>('midas');
  const [category, setCategory] = useState<AssetCategory>('bist');
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costBasis, setCostBasis] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('TRY');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const qty = parseFloat(quantity) || 0;
    const cost = parseFloat(costBasis) || 0;

    const success = await addHolding({
      platform,
      category,
      symbol: symbol.trim().toUpperCase(),
      name: name.trim() || symbol.trim().toUpperCase(),
      quantity: qty,
      cost_basis: cost,
      currency,
      notes: notes.trim(),
    });

    setSubmitting(false);

    if (success) {
      // Reset form
      setSymbol('');
      setName('');
      setQuantity('');
      setCostBasis('');
      setNotes('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="w-6 h-6 text-slate-900 dark:text-slate-100" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Yatırım Pozisyonu Ekle
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Platform & Category selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Yatırım Platformu
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformType)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 font-semibold"
              >
                <option value="binance_tr">Binance TR</option>
                <option value="bybit">Bybit</option>
                <option value="isbank">İş Bankası</option>
                <option value="midas">Midas</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Varlık Kategorisi
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 font-semibold"
              >
                <option value="bist">BIST Hissesi</option>
                <option value="crypto">Kripto Para</option>
                <option value="tefas">TEFAS Yatırım Fonu</option>
                <option value="fiat">Döviz / Nakit</option>
                <option value="gold">Altın / Değerli Maden</option>
              </select>
            </div>
          </div>

          {/* Stock ID / Symbol & Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Hisse / Varlık Kodu *
              </label>
              <input
                type="text"
                required
                placeholder="ör: THYAO, BTC, TCD, EUR"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Varlık Adı
              </label>
              <input
                type="text"
                placeholder="ör: Türk Hava Yolları"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Quantity, Currency & Buy Price */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Miktar *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Para Birimi
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 font-semibold"
              >
                <option value="TRY">TRY (₺)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Ort. Alış Fiyatı *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={costBasis}
                onChange={(e) => setCostBasis(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Notlar / Strateji (İsteğe Bağlı)
            </label>
            <input
              type="text"
              placeholder="ör: İşbankasındaki euro birikim hesabı"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Submit button */}
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
              disabled={submitting}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-slate-100 dark:text-slate-900 font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Kaydediliyor...' : 'Pozisyonu Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
