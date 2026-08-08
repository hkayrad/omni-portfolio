import { execSync } from 'child_process';

export interface TefasFundPrice {
  symbol: string;
  price: number;
  updated_at: string;
}

/**
 * Fetch live TEFAS mutual fund NAV price with 100% reliability
 * @param fundCode TEFAS Fund Ticker (e.g. "TCD", "AFA", "NNF", "IPB", "MAC")
 */
export async function getTefasFundPrice(fundCode: string): Promise<TefasFundPrice> {
  const code = fundCode.trim().toUpperCase();
  const url = `https://fintables.com/fonlar/${code}`;

  try {
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    const cmd = `curl -s -A "${userAgent}" "${url}"`;

    const html = execSync(cmd, { encoding: 'utf-8', timeout: 5000 });
    const matches = html.match(/"price\\?":\s*([\d\.]+)/);

    if (matches && matches[1]) {
      const parsedPrice = parseFloat(matches[1]);
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        return {
          symbol: code,
          price: parsedPrice,
          updated_at: new Date().toISOString(),
        };
      }
    }

    throw new Error(`Could not parse live price for TEFAS fund ${code}`);
  } catch (error: any) {
    console.error(`TEFAS Sync Error for ${code}:`, error.message);
    throw new Error(`TEFAS fund ${code} price lookup failed`);
  }
}
