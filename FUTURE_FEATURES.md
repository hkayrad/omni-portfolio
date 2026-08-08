# 🚀 Future Feature Roadmap & Ideas for OmniPortfolio

A structured feature roadmap and enhancement wishlist for the **OmniPortfolio Investment Tracker**. Designed for personal home-server hosting, seamless multi-asset tracking, and automated financial analytics.

---

## 📋 Table of Contents

- [1. Exchange & Broker Integrations](#1-exchange--broker-integrations)
- [2. Advanced Analytics & Risk Metrics](#2-advanced-analytics--risk-metrics)
- [3. Automation & Smart Notifications](#3-automation--smart-notifications)
- [4. UI/UX & Privacy Enhancements](#4-uiux--privacy-enhancements)
- [5. Home Server & Mobile PWA Features](#5-home-server--mobile-pwa-features)

---

## 1. Exchange & Broker Integrations

| Feature | Target Platform | Description | Priority |
| :--- | :--- | :--- | :--- |
| **Midas CSV/Excel Importer** | Midas | 1-click drag-and-drop parser for Midas transaction export files (BIST & US Stocks). Auto-calculates cost basis and quantities. | 🔥 High |
| **Bybit V5 Full Trade Sync** | Bybit | Sync spot balances, Earn/Staking yields, and open derivatives positions using Bybit V5 REST API. | 🔥 High |
| **Binance Global & OKX API** | Binance / OKX | Support for Binance Global and OKX API keys to aggregate international crypto holdings. | 💡 Medium |
| **Turkish Open Banking Gateways** | İşbank / Garanti / Akbank | Explore BDDK / TCMB Open Banking (PSD2) API integrations for Turkish bank account balance sync. | 🔮 Long-term |

---

## 2. Advanced Analytics & Risk Metrics

- [ ] **Benchmark Comparison Engine**:
  - Compare portfolio ROI growth against **BIST 100 (`XU100`)**, **S&P 500 (`SPX`)**, **Bitcoin (`BTC`)**, **Gold (`XAU/TRY`)**, and **TÜİK TÜFE Inflation**.
- [ ] **BIST Dividend Tracker**:
  - Automated dividend calendar for BIST stocks (e.g. `TUPRS`, `EGRT`, `FROTO`).
  - Projected annual passive dividend income summary card.
- [ ] **Rebalancing Calculator**:
  - Set target asset allocation ratios (e.g., 40% BIST, 30% Crypto, 20% TEFAS, 10% Gold).
  - Calculate exact buy/sell orders needed to rebalance portfolio to targets.
- [ ] **Risk & Drawdown Metrics**:
  - Calculate **Sharpe Ratio**, **Maximum Drawdown (MDD)**, and **Volatility Beta**.

---

## 3. Automation & Smart Notifications

- [ ] **Telegram & Discord Bot Alerts**:
  - Daily 09:00 & 18:00 TSI portfolio summary message delivered to your personal Telegram channel or Discord webhook.
  - Instant alert when any asset price swings >5% in 24 hours.
- [ ] **TEFAS Daily NAV Update Alert**:
  - Notification when Takasbank updates daily TEFAS fund unit prices (around ~11:00 TSI).
- [ ] **Automated Database Backup**:
  - Scheduled daily SQLite database (`portfolio.sqlite`) backup sent to Telegram or cloud storage.

---

## 4. UI/UX & Privacy Enhancements

- [ ] **Stealth / Privacy Mode (`*** ₺`)**:
  - 1-click toggle on the header to blur/mask monetary values and asset quantities for safe screenshot sharing.
- [ ] **Multi-Currency Unit Switcher**:
  - Toggle total net worth view natively between **TRY (₺)**, **USD ($)**, **EUR (€)**, and **Gold Grams (XAU)**.
- [ ] **Custom Tags & Asset Labels**:
  - Tag positions with custom labels: `Long-term Core`, `Speculative`, `Passive Income`, `Emergency Fund`.

---

## 5. Home Server & Mobile PWA Features

- [ ] **PWA (Progressive Web App) Support**:
  - Web App Manifest + Service Worker to install OmniPortfolio natively on iPhone (iOS Safari) & Android Home Screens.
- [ ] **Multi-User / Family Mode**:
  - Create separate sub-portfolios (e.g., *Personal*, *Spouse*, *Retirement*) with aggregated family total net worth view.
- [ ] **Dark / OLED Black Mode**:
  - Add pure `#000000` pitch black mode for OLED mobile screens.

---

*Feel free to pick any feature from this roadmap to implement next!* 🚀
