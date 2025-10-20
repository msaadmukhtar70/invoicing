import React from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

import { defaultGradientId, gradientOptions } from "@/lib/gradients";
import type { GradientId } from "@/lib/gradients";
import { mixHexColors } from "@/lib/colors";
import type { CurrencyCode, Invoice } from "@/lib/types";

import {
  currencyMeta,
  currencyMetaByCode,
  dashboardAccentColor,
  labelClass,
  sectionClass,
} from "./constants";

type OtherInfoSectionProps = {
  form: Pick<UseFormReturn<Invoice>, "register" | "control" | "setValue">;
  className?: string;
};

const OtherInfoSection: React.FC<OtherInfoSectionProps> = ({ form, className }) => {
  const { register, control, setValue } = form;

  const selectedCurrency = useWatch({ control, name: "currency" }) as CurrencyCode | undefined;
  const gradientValueRaw = useWatch({ control, name: "gradient" }) as GradientId | undefined;

  const gradientValue = gradientValueRaw ?? defaultGradientId;

  const selectedGradient = React.useMemo(() => {
    return (
      gradientOptions.find((option) => option.id === gradientValue) ??
      gradientOptions.find((option) => option.id === defaultGradientId) ??
      gradientOptions[0]
    );
  }, [gradientValue]);

  const handleCurrencyPick = React.useCallback(
    (code: CurrencyCode) => {
      const meta = currencyMetaByCode[code];
      setValue("currency", code, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setValue("currencySymbol", meta.symbol, { shouldDirty: true, shouldTouch: true });
    },
    [setValue]
  );

  const handleGradientPick = React.useCallback(
    (id: GradientId) => {
      setValue("gradient", id, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    },
    [setValue]
  );

  const gradientField = register("gradient");

  return (
    <section className={`${sectionClass} overflow-hidden ${className ?? ""}`}>
      <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Other information</div>
      <div className="space-y-4 pt-5">
        <div>
          <div className={labelClass}>Currencies</div>
          <div className="mt-3 rounded-[32px] border border-slate-200 bg-white p-4 shadow-inner">
            <div className="flex flex-wrap gap-2 text-[10px] sm:text-[11px]">
              {currencyMeta.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleCurrencyPick(currency.code)}
                  className={`flex min-w-max items-center gap-1 rounded-full border px-3 py-1.5 font-semibold transition ${
                    selectedCurrency === currency.code
                      ? "border-brix-blue bg-brix-blue/10 text-brix-blue shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-brix-blue/40"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 ${currency.colorClass ?? "text-slate-600"}`}
                    aria-hidden
                  >
                    <currency.Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-none">
                    ({currency.code}) {currency.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className={labelClass}>Gradient</div>
          <input type="hidden" {...gradientField} value={gradientValue} />
          <div className="mt-3 grid grid-cols-1 gap-3">
            {gradientOptions.map((option) => {
              const isActive = option.id === selectedGradient.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleGradientPick(option.id)}
                  className={`flex items-center gap-4 rounded-2xl border p-3 transition ${
                    isActive ? "shadow-sm" : "hover:border-slate-300"
                  }`}
                  style={{
                    borderColor: isActive ? dashboardAccentColor : "#E2E8F0",
                    background: isActive ? mixHexColors(dashboardAccentColor, "#FFFFFF", 0.75) : "#FFFFFF",
                  }}
                >
                  <span className={`h-10 w-10 shrink-0 rounded-lg ${option.swatchClass}`} aria-hidden />
                  <span className="flex min-w-0 flex-col text-left">
                    <span className="truncate text-sm font-semibold leading-tight text-slate-700">{option.name}</span>
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wide"
                      style={isActive ? { color: dashboardAccentColor } : undefined}
                    >
                      {isActive ? "Active" : "Select"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-inner">
            <div className={`relative mx-auto h-28 w-full max-w-[220px] overflow-hidden rounded-[32px] ${selectedGradient.backgroundClass}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedGradient.highlightClass} opacity-70`} />
              <div className="absolute inset-6 rounded-[28px] border border-white/60 bg-white/20 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtherInfoSection;
