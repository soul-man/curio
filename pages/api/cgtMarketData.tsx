import NodeCache from "node-cache";
import { setTimeout } from 'timers/promises';

const cache = new NodeCache({ stdTTL: 900 }); // 15 minute

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export default async function handler(req: any, res: any) {
  const urlMarketDataCgt = 'https://api.coingecko.com/api/v3/coins/curio-gas-token';
  const urlHistoricalDataCgt = 'https://api.coingecko.com/api/v3/coins/curio-gas-token/market_chart?vs_currency=usd&days=30&interval=daily';

  const formatDate = (date: string): string => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const timestamp = new Date(date);
    const day = `${timestamp.getDate()}`.padStart(2, "0");
    const month = months[timestamp.getMonth()];
    const year = timestamp.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<any> {
    try {
      const response = await fetch(url);
      if (response.status === 429 && retries > 0) {
        console.log(`Rate limited. Retrying in ${RETRY_DELAY}ms...`);
        await setTimeout(RETRY_DELAY);
        return fetchWithRetry(url, retries - 1);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      if (retries > 0) {
        console.log(`Error occurred. Retrying in ${RETRY_DELAY}ms...`);
        await setTimeout(RETRY_DELAY);
        return fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  }

  async function getCgtMarketData() {
    try {
      const cachedData = cache.get<any>(urlMarketDataCgt);
      if (cachedData) {
        console.log('Cache hit');
        return cachedData;
      }

      console.log('Cache miss');
      const [marketData, historicalData] = await Promise.all([
        fetchWithRetry(urlMarketDataCgt),
        fetchWithRetry(urlHistoricalDataCgt)
      ]);
      
      // Check if required data exists
      if (!marketData?.market_data) {
        throw new Error('Market data is missing from CoinGecko response');
      }
      
      if (!historicalData?.prices) {
        throw new Error('Historical price data is missing from CoinGecko response');
      }

      const cgtData = {
        marketPrice: marketData.market_data.current_price?.usd?.toFixed(4) || '0.0000',
        marketPriceHigh_24h: marketData.market_data.high_24h?.usd?.toFixed(4) || '0.0000',
        marketPriceLow_24h: marketData.market_data.low_24h?.usd?.toFixed(4) || '0.0000',
        volume: marketData.market_data.total_volume?.usd || 0,
        marketCap: marketData.market_data.market_cap?.usd || 0,
        priceChange_24h: marketData.market_data.price_change_percentage_24h?.toFixed(2) || '0.00',
        priceChange_7d: marketData.market_data.price_change_percentage_7d?.toFixed(2) || '0.00',
        priceChange_14d: marketData.market_data.price_change_percentage_14d?.toFixed(2) || '0.00',
        priceChange_30d: marketData.market_data.price_change_percentage_30d?.toFixed(2) || '0.00',
        priceChange_60d: marketData.market_data.price_change_percentage_60d?.toFixed(2) || '0.00',
        ath: marketData.market_data.ath?.usd?.toFixed(4) || '0.0000',
        athTime: marketData.market_data.ath_date?.usd ? formatDate(marketData.market_data.ath_date.usd) : 'N/A',
        athChange: marketData.market_data.ath_change_percentage?.usd?.toFixed(2) || '0.00',
        atl: marketData.market_data.atl?.usd?.toFixed(4) || '0.0000',
        atlTime: marketData.market_data.atl_date?.usd ? formatDate(marketData.market_data.atl_date.usd) : 'N/A',
        atlChange: marketData.market_data.atl_change_percentage?.usd?.toFixed(2) || '0.00',
        marketCapRank: marketData.market_cap_rank || null,
        historicalData: historicalData.prices || []
      };

      cache.set(urlMarketDataCgt, cgtData);
      return cgtData;
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  }
  
  try {
    const cgtMarketData = await getCgtMarketData();
    res.status(200).json(cgtMarketData);
  } catch (error) {
    console.error('API Error Details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('Error message:', errorMessage);
    console.error('Error stack:', errorStack);
    
    res.status(500).json({ 
      error: 'An error occurred while fetching data',
      details: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}