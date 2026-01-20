import { observable } from "@legendapp/state";
import { StockData } from "./types";

const generateMockStocks = (count: number): StockData[] => {
  const symbols = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "NVDA", name: "NVIDIA Corp." },
    { symbol: "META", name: "Meta Platforms Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "BRK.B", name: "Berkshire Hathaway" },
    { symbol: "JPM", name: "JPMorgan Chase" },
    { symbol: "V", name: "Visa Inc." },
    { symbol: "UNH", name: "UnitedHealth Group" },
    { symbol: "HD", name: "Home Depot Inc." },
    { symbol: "PG", name: "Procter & Gamble" },
    { symbol: "MA", name: "Mastercard Inc." },
    { symbol: "DIS", name: "Walt Disney Co." },
    { symbol: "PYPL", name: "PayPal Holdings" },
    { symbol: "NFLX", name: "Netflix Inc." },
    { symbol: "ADBE", name: "Adobe Inc." },
    { symbol: "CRM", name: "Salesforce Inc." },
    { symbol: "INTC", name: "Intel Corp." },
  ];

  const stocks: StockData[] = [];

  for (let i = 0; i < count; i++) {
    const base = symbols[i % symbols.length];
    const suffix = i >= symbols.length ? `-${Math.floor(i / symbols.length)}` : "";
    const basePrice = 50 + Math.random() * 450;
    const change = (Math.random() - 0.5) * 20;

    stocks.push({
      id: `stock-${i}`,
      symbol: `${base.symbol}${suffix}`,
      name: base.name,
      price: Math.round(basePrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round((change / basePrice) * 10000) / 100,
      volume: Math.floor(Math.random() * 50000000),
      marketCap: Math.floor(Math.random() * 2000000000000),
      high52w: Math.round((basePrice * 1.3) * 100) / 100,
      low52w: Math.round((basePrice * 0.7) * 100) / 100,
    });
  }

  return stocks;
};

// Observable store - each stock is individually observable for fine-grained reactivity
export const store$ = observable({
  stocks: {} as Record<string, StockData>,
  stockIds: [] as string[],
  isLoading: false,
});

// Simulate API fetch
export const fetchStocks = async (count: number = 100): Promise<void> => {
  store$.isLoading.set(true);

  await new Promise((resolve) => setTimeout(resolve, 500));

  const stocks = generateMockStocks(count);
  const stocksMap: Record<string, StockData> = {};
  const ids: string[] = [];

  stocks.forEach((stock) => {
    stocksMap[stock.id] = stock;
    ids.push(stock.id);
  });

  store$.stocks.set(stocksMap);
  store$.stockIds.set(ids);
  store$.isLoading.set(false);
};

// Update a single field - only subscribers to this path re-render
export const updateStockField = <K extends keyof StockData>(
  stockId: string,
  field: K,
  value: StockData[K]
): void => {
  const stockObs = store$.stocks[stockId];
  if (stockObs) {
    // Use type assertion for dynamic field access
    (stockObs[field] as { set: (v: StockData[K]) => void }).set(value);
  }
};

// Simulate real-time price updates
export const startPriceSimulation = (intervalMs: number = 100): (() => void) => {
  const interval = setInterval(() => {
    const ids = store$.stockIds.peek();
    if (ids.length === 0) return;

    const randomId = ids[Math.floor(Math.random() * ids.length)];
    const stock = store$.stocks[randomId].peek();

    if (stock) {
      const priceChange = (Math.random() - 0.5) * 2;
      const newPrice = Math.round((stock.price + priceChange) * 100) / 100;
      const newChange = Math.round(priceChange * 100) / 100;
      const newChangePercent = Math.round((priceChange / stock.price) * 10000) / 100;

      updateStockField(randomId, "price", newPrice);
      updateStockField(randomId, "change", newChange);
      updateStockField(randomId, "changePercent", newChangePercent);
    }
  }, intervalMs);

  return () => clearInterval(interval);
};
