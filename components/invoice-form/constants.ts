import type { ComponentType } from "react";

import { Bitcoin, DollarSign, Euro, JapaneseYen, PoundSterling, SwissFranc } from "lucide-react";

import type { CurrencyCode } from "@/lib/types";

export const currencyCodes = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CNY",
  "MXN",
  "BTC",
] as const satisfies readonly CurrencyCode[];

export const sectionClass =
  "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";
export const labelClass =
  "text-xs font-semibold uppercase tracking-wide text-slate-500";
export const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:bg-white focus:ring-2 focus:ring-brix-blue/30";
export const textareaClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:bg-white focus:ring-2 focus:ring-brix-blue/30";

export const dashboardAccentColor = "#FF5722";

export const hexColorRegExp = /^#([0-9A-Fa-f]{6})$/;

export const currencyMeta: {
  code: CurrencyCode;
  symbol: string;
  Icon: ComponentType<{ className?: string }>;
  colorClass?: string;
}[] = [
  { code: "USD", symbol: "$", Icon: DollarSign, colorClass: "bg-blue-100 text-blue-600" },
  { code: "EUR", symbol: "\u20AC", Icon: Euro, colorClass: "bg-indigo-100 text-indigo-600" },
  { code: "GBP", symbol: "\u00A3", Icon: PoundSterling, colorClass: "bg-purple-100 text-purple-600" },
  { code: "JPY", symbol: "\u00A5", Icon: JapaneseYen, colorClass: "bg-rose-100 text-rose-500" },
  { code: "CHF", symbol: "CHF", Icon: SwissFranc, colorClass: "bg-red-100 text-red-500" },
  { code: "CNY", symbol: "\u00A5", Icon: JapaneseYen, colorClass: "bg-orange-100 text-orange-500" },
  { code: "MXN", symbol: "$", Icon: DollarSign, colorClass: "bg-emerald-100 text-emerald-600" },
  { code: "BTC", symbol: "\u20BF", Icon: Bitcoin, colorClass: "bg-amber-100 text-amber-600" },
];

export const currencyMetaByCode = currencyMeta.reduce<
  Record<CurrencyCode, (typeof currencyMeta)[number]>
>((acc, item) => {
  acc[item.code] = item;
  return acc;
}, {} as Record<CurrencyCode, (typeof currencyMeta)[number]>);
