import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface TradingViewProps {
  symbol?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

/**
 * Safely format symbols for TradingView Widget
 */
const getValidTradingViewSymbol = (rawSymbol: string): string => {
  if (!rawSymbol) return 'BIST:XU100';
  const sym = rawSymbol.trim().toUpperCase();

  // If symbol already includes exchange prefix (e.g. BIST:THYAO, BINANCE:BTCTRY)
  if (sym.includes(':')) return sym;

  // TEFAS Mutual Funds do not exist on TradingView -> fallback to BIST 100 index chart
  const knownTefasFunds = ['TCD', 'AFA', 'NNF', 'IPB', 'MAC', 'TI1', 'TTA', 'FON', 'PHE', 'PBR', 'CPT'];
  if (knownTefasFunds.includes(sym)) {
    return 'BIST:XU100';
  }

  // Forex & Metals
  if (sym === 'USD' || sym === 'USDTRY') return 'FX:USDTRY';
  if (sym === 'EUR' || sym === 'EURTRY') return 'FX:EURTRY';
  if (sym === 'GLD' || sym === 'XAU') return 'OANDA:XAUUSD';

  // Major Crypto pairs
  if (['BTC', 'ETH', 'SOL', 'XRP', 'AVAX', 'USDT'].includes(sym)) {
    return `BINANCE:${sym}TRY`;
  }

  // Default BIST stock prefix
  return `BIST:${sym}`;
};

export const TradingViewWidget: React.FC<TradingViewProps> = ({ symbol = 'BIST:XU100' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const formattedSymbol = getValidTradingViewSymbol(symbol);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const containerId = `tv_widget_${Math.random().toString(36).substring(7)}`;
    const widgetDiv = document.createElement('div');
    widgetDiv.id = containerId;
    widgetDiv.style.width = '100%';
    widgetDiv.style.height = '100%';
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: formattedSymbol,
          interval: 'D',
          timezone: 'Europe/Istanbul',
          theme: theme === 'dark' ? 'dark' : 'light',
          style: '1',
          locale: 'tr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
        });
      }
    };
    containerRef.current.appendChild(script);
  }, [formattedSymbol, theme]);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
