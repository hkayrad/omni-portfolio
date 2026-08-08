# ⚠️ DISCLAIMER: THIS APP WAS 100% VIBE CODED ⚠️

> [!WARNING]
> ### **✨ NOTICE: THIS APPLICATION WAS ENTIRELY VIBE CODED ✨**
> Built with raw vibes, high-octane iteration, and AI pair-programming magic. 
> Expect slick dark mode aesthetics, zero-lag metrics, and immaculate main-character portfolio tracking energy. Proceed with good vibes only! 🚀📈

---

# 📈 Multi-Asset Investment Portfolio Tracker

A unified, responsive, privacy-focused personal investment dashboard designed to track **BIST (Borsa İstanbul)**, **Crypto**, **TEFAS Mutual Funds**, **Gold**, and **Fiat currencies** in a single user interface. Integrates automated API sync for supported crypto exchanges (**Binance TR**, **Bybit**) and manual Stock/Asset ID entry with automated price fetching for non-API brokers and banks (**İş Bankası**, **Midas**).

Built with **React**, **Vite**, **TypeScript**, **shadcn/ui** (Slate palette & Dark Mode), **Node.js + Express** server with a file-based database (**SQLite**), **Docker & Docker Compose** for home server container deployment.

---

## 📋 Table of Contents

- [1. Platform & API Integration Analysis](#1-platform--api-integration-analysis)
  - [Binance TR Integration](#binance-tr-integration)
  - [Bybit Integration](#bybit-integration)
  - [Midas Integration](#midas-integration)
  - [İş Bankası Integration](#i%C5%9F-bankas%C4%B1-integration)
  - [BIST, TEFAS, Gold & Fiat Market Data Sources](#bist-tefas-gold--fiat-market-data-sources)
- [2. System Architecture & Tech Stack](#2-system-architecture--tech-stack)
- [3. UI & Responsive Design System](#3-ui--responsive-design-system)
  - [Slate Design System & Base UI](#slate-design-system--base-ui)
  - [Dark Mode & Light Mode Theme Tokens](#dark-mode--light-mode-theme-tokens)
  - [Mobile & Desktop Layout Breakdown](#mobile--desktop-layout-breakdown)
- [4. Node.js Backend & File Database Architecture](#4-nodejs-backend--file-database-architecture)
  - [SQLite File Database Schema](#sqlite-file-database-schema)
  - [Node.js Express Server Implementation](#nodejs-express-server-implementation)
- [5. Charting & Visualization System](#5-charting--visualization-system)
  - [TradingView Integration](#tradingview-integration)
  - [Chart Libraries Comparison Matrix](#chart-libraries-comparison-matrix)
- [6. Environment Configuration (`.env`)](#6-environment-configuration-env)
- [7. Docker Home Server Deployment Guide (Recommended)](#7-docker-home-server-deployment-guide-recommended)
- [8. cPanel Node.js Deployment Guide](#8-cpanel-nodejs-deployment-guide)
- [9. Project File Structure](#9-project-file-structure)
- [10. Setup & Local Development Guide](#10-setup--local-development-guide)

---

## 7. Docker Home Server Deployment Guide (Recommended)

You can easily deploy and host OmniPortfolio on your **Home Server** (NAS, Raspberry Pi, Unraid, Portainer, or Ubuntu Home Server) using **Docker** and **Docker Compose**.

### 1-Step Docker Compose Deployment

1. **Clone the repository on your home server:**
   ```bash
   git clone https://github.com/your-username/investment-tracker.git
   cd investment-tracker
   ```

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env to add your JWT_SECRET and optional exchange API keys
   ```

3. **Start container in detached mode:**
   ```bash
   docker compose up -d --build
   ```

4. **Access your dashboard:**
   Open `http://<your-home-server-ip>:3000` in your browser.

### Docker Persistent Volume Architecture
The `docker-compose.yml` mounts `./db:/app/db` to persist your SQLite database file (`portfolio.sqlite`) on your host storage:

```yaml
services:
  portfolio-tracker:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: omni-portfolio-tracker
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_FILE_PATH=/app/db/portfolio.sqlite
    env_file:
      - .env
    volumes:
      - ./db:/app/db
```

---

## 8. cPanel Node.js Deployment Guide

### cPanel Node.js Selector Setup
1. Log into your **cPanel Dashboard**.
2. Navigate to **Software** -> **Setup Node.js App**.
3. Click **Create Application**:
   - **Node.js version**: Choose `18.x` or `20.x`.
   - **Application mode**: `Production`.
   - **Application startup file**: `dist/server/index.js` (or `app.js`).

---

## 9. Setup & Local Development Guide

### Prerequisites
- **Node.js**: v18.0.0 or later
- **Docker**: Version 20.10+ (for container deployment)

### Local Run
```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Vite + Express)
npm run dev

# 3. Production Build
npm run build
```

---

### 🛡️ Privacy & Security Note
- Your **API Keys** and **Portfolio Holdings** are stored locally on your own home server inside your SQLite file database (`portfolio.sqlite`). No sensitive data is transmitted to third-party tracking servers.
