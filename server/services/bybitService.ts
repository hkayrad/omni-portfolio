import axios from 'axios';
import crypto from 'crypto';

export interface BybitAssetBalance {
  coin: string;
  equity: number;
  walletBalance: number;
}

/**
 * Synchronize user Unified/Spot wallet balances from Bybit V5 REST API
 */
export async function getBybitUserBalances(apiKey: string, apiSecret: string): Promise<BybitAssetBalance[]> {
  const timestamp = Date.now().toString();
  const recvWindow = '5000';
  const queryString = `accountType=UNIFIED`;

  const preHash = timestamp + apiKey + recvWindow + queryString;

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(preHash)
    .digest('hex');

  const url = `https://api.bybit.com/v5/account/wallet-balance?${queryString}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-BAPI-API-KEY': apiKey,
        'X-BAPI-SIGN': signature,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': recvWindow,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response.data && response.data.retCode === 0 && response.data.result?.list) {
      const coins = response.data.result.list[0]?.coin || [];
      const nonZeroAssets: BybitAssetBalance[] = [];

      for (const item of coins) {
        const equity = parseFloat(item.equity || item.walletBalance) || 0;
        const walletBalance = parseFloat(item.walletBalance) || 0;

        if (equity > 0.00001 || walletBalance > 0.00001) {
          nonZeroAssets.push({
            coin: item.coin,
            equity,
            walletBalance,
          });
        }
      }

      return nonZeroAssets;
    }

    throw new Error(response.data?.retMsg || 'Failed to fetch Bybit wallet balances');
  } catch (error: any) {
    console.error('Bybit V5 Sync Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.retMsg || error.message || 'Bybit account sync failed');
  }
}
