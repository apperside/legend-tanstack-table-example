import { useState, useRef, useEffect } from "react";
import { useValue } from "@legendapp/state/react";
import { store$, updateStockField } from "../store";

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

// Editable cell with fine-grained reactivity
// Only subscribes to the name field - editing won't cause other cells to re-render
export const EditableNameCell = ({ stockId }: { stockId: string }) => {
  // Fine-grained subscription - only re-renders when THIS stock's name changes
  const name = useValue(store$.stocks[stockId].name);

  // Local state for edit mode - doesn't affect other cells
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setEditValue(name ?? "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim() && editValue !== name) {
      // Updates only the name field - fine-grained update
      updateStockField(stockId, "name", editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <td className="editable-cell editing">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="cell-input"
        />
      </td>
    );
  }

  return (
    <td className="editable-cell" onDoubleClick={handleDoubleClick}>
      <span className="cell-value">{name ?? "—"}</span>
      <span className="edit-hint">✎</span>
    </td>
  );
};
