import { useValue } from "@legendapp/state/react";
import { store$ } from "../store";

// Fine-grained reactive cell components using Legend State v3 API
// Each uses useValue() to subscribe to only ONE specific field of ONE specific stock

export const PriceCell = ({ stockId }: { stockId: string }) => {
  // useValue() subscribes to this specific observable path
  const price = useValue(store$.stocks[stockId].price);

  return <td className="text-right">${price?.toFixed(2) ?? "—"}</td>;
};

export const ChangeCell = ({ stockId }: { stockId: string }) => {
  const change = useValue(store$.stocks[stockId].change);
  const isPositive = (change ?? 0) >= 0;

  return (
    <td className={`text-right ${isPositive ? "positive" : "negative"}`}>
      {isPositive ? "+" : ""}
      {change?.toFixed(2) ?? "—"}
    </td>
  );
};

export const ChangePercentCell = ({ stockId }: { stockId: string }) => {
  const changePercent = useValue(store$.stocks[stockId].changePercent);
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <td className={`text-right ${isPositive ? "positive" : "negative"}`}>
      {isPositive ? "+" : ""}
      {changePercent?.toFixed(2) ?? "—"}%
    </td>
  );
};

export const VolumeCell = ({ stockId }: { stockId: string }) => {
  const volume = useValue(store$.stocks[stockId].volume);

  return <td className="text-right">{volume?.toLocaleString() ?? "—"}</td>;
};

export const MarketCapCell = ({ stockId }: { stockId: string }) => {
  const marketCap = useValue(store$.stocks[stockId].marketCap);

  let displayValue = "—";
  if (marketCap !== undefined) {
    if (marketCap >= 1e12) displayValue = `$${(marketCap / 1e12).toFixed(2)}T`;
    else if (marketCap >= 1e9) displayValue = `$${(marketCap / 1e9).toFixed(2)}B`;
    else displayValue = `$${(marketCap / 1e6).toFixed(2)}M`;
  }

  return <td className="text-right">{displayValue}</td>;
};

// Static cell - uses peek() since these values don't change
export const StaticCell = ({ children }: { children: React.ReactNode }) => {
  return <td>{children}</td>;
};
