import { CurrencyCode } from "./types";

export const currencySymbols: Record<CurrencyCode, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  MXN: "🇲🇽",
  BTC: "🪙",
};

export function formatMoney(value: number, code: CurrencyCode, symbol?: string) {
  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: code, currencyDisplay: "symbol" });
  const withIso = new Intl.NumberFormat("en-US", { style: "currency", currency: code, currencyDisplay: "code" });
  // Intl will choose symbol already; if custom symbol is provided, prepend it manually.
  const formatted = fmt.format(value);
  if (symbol && symbol !== "") {
    // replace first character(s) before digits with custom symbol
    const digitsIndex = formatted.search(/[0-9]/);
    return symbol + formatted.slice(digitsIndex);
  }
  return formatted;
}

export function total(items: { qty: number; price: number }[]) {
  return items.reduce((acc, it) => acc + it.qty * it.price, 0);
}
