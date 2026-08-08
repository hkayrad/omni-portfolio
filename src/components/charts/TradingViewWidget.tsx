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

export const TradingViewWidget: React.FC<TradingViewProps> = ({ symbol = 'BIST:XU100' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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
          symbol: symbol,
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
  }, [symbol, theme]);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
