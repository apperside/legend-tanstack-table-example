// Types for our trading data
export interface StockData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52w: number;
  low52w: number;
}

export interface StockUpdate {
  id: string;
  field: keyof StockData;
  value: number;
}
