"use client";
import React from "react";
import { Invoice } from "@/lib/types";
import { formatMoney, total } from "@/lib/currency";
import { resolveGradient } from "@/lib/gradients";
import { defaultBrandColor, mixHexColors, hexToRgba, NO_BRAND_COLOR } from "@/lib/colors";

const HEX_WHITE = "#FFFFFF";
const HEX_BLACK = "#000000";
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;
const NEUTRAL_BASE = "#1F2937";

const createPalette = (base: string, options?: { light?: number; lighter?: number; dark?: number; shadow?: number }) => {
  const lightRatio = options?.light ?? 0.35;
  const lighterRatio = options?.lighter ?? 0.55;
  const darkRatio = options?.dark ?? 0.25;
  const shadowOpacity = options?.shadow ?? 0.35;
  return {
    base,
    light: mixHexColors(base, HEX_WHITE, lightRatio),
    lighter: mixHexColors(base, HEX_WHITE, lighterRatio),
    dark: mixHexColors(base, HEX_BLACK, darkRatio),
    shadow: hexToRgba(base, shadowOpacity),
  };
};

const buildBrandPalette = (color?: string) => {
  if (color === NO_BRAND_COLOR) {
    return createPalette(NEUTRAL_BASE, { lighter: 0.65, dark: 0.2, shadow: 0.22 });
  }
  if (color && HEX_COLOR_REGEX.test(color)) {
    return createPalette(color.toUpperCase());
  }
  return createPalette(defaultBrandColor);
};

export function HeaderLogo({ inv }: { inv: Invoice }) {
  const palette = React.useMemo(() => buildBrandPalette(inv.brandColor), [inv.brandColor]);
  return (
    <div className="flex items-center gap-3">
      <div
        className="rounded-2xl px-4 py-2 text-xl font-bold text-white"
        style={{
          background: `linear-gradient(135deg, ${palette.base}, ${palette.light})`,
          boxShadow: `0 12px 28px ${palette.shadow}`,
        }}
      >
        {inv.brandName || "brix"}
      </div>
      {inv.from.taxNumber && <div className="text-slate-500 text-sm">{inv.from.taxNumber}</div>}
    </div>
  );
}

export function MoneyBig({ value, inv }: { value: number; inv: Invoice }) {
  const palette = React.useMemo(() => buildBrandPalette(inv.brandColor), [inv.brandColor]);
  return (
    <div className="text-3xl md:text-4xl font-extrabold" style={{ color: palette.base }}>
      {formatMoney(value, inv.currency, inv.currencySymbol)}
    </div>
  );
}

export const computeTotals = (inv: Invoice) => {
  const sub = total(inv.items);
  const grand = sub - (inv.discount || 0) + (inv.tax || 0);
  return { sub, grand };
};

export function TemplateFrame({
  inv,
  className,
  children,
}: {
  inv: Invoice;
  className?: string;
  children: React.ReactNode;
}) {
  const palette = React.useMemo(() => buildBrandPalette(inv.brandColor), [inv.brandColor]);
  const gradient = resolveGradient(inv.gradient);

  return (
    <div
      className={`relative overflow-hidden rounded-[36px] p-1 ${gradient.backgroundClass}`}
      style={
        {
          "--brand-color": palette.base,
          "--brand-color-light": palette.light,
          "--brand-color-lighter": palette.lighter,
          "--brand-color-shadow": palette.shadow,
        } as React.CSSProperties
      }
    >
      <div className="relative rounded-[34px] border border-slate-200 bg-white shadow-soft">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient.highlightClass} opacity-30`}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            background: `radial-gradient(120% 120% at 0% 0%, ${palette.lighter}40, transparent)`,
          }}
        />
        <div className={`relative z-10 rounded-[34px] bg-white/95 backdrop-blur-sm ${className ?? ""}`}>{children}</div>
      </div>
    </div>
  );
}
