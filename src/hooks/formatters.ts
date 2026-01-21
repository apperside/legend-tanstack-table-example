// formatters.ts
export function formatValue(value: unknown, format?: string): string {
  if (value == null) return "";

  switch (format) {
    case "currency":
      return typeof value === "number"
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)
        : String(value);
    case "percent":
      return typeof value === "number"
        ? `${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`
        : String(value);
    case "number":
      return typeof value === "number" ? value.toLocaleString() : String(value);
    case "date":
      return value instanceof Date ? value.toLocaleDateString() : String(value);
    default:
      return String(value);
  }
}
