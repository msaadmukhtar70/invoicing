import React from "react";
import { useWatch } from "react-hook-form";

import type { CurrencyCode } from "@/lib/types";

import {
  currencyMeta,
  currencyMetaByCode,
  labelClass,
  sectionClass,
  requiredMarkClass,
  requiredSrOnlyClass,
} from "./constants";
import type { InvoiceFormContext } from "./formTypes";

type OtherInfoSectionProps = {
  form: Pick<InvoiceFormContext, "control" | "setValue">;
  className?: string;
};

const OtherInfoSection: React.FC<OtherInfoSectionProps> = ({ form, className }) => {
  const { control, setValue } = form;

  const selectedCurrency = useWatch({ control, name: "currency" }) as CurrencyCode | undefined;

  const handleCurrencyPick = React.useCallback(
    (code: CurrencyCode) => {
      // Keep currency code and symbol in sync with the shared metadata in constants.ts.
      const meta = currencyMetaByCode[code];
      setValue("currency", code, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setValue("currencySymbol", meta.symbol, { shouldDirty: true, shouldTouch: true });
    },
    [setValue]
  );

  return (
    <section className={`${sectionClass} overflow-hidden ${className ?? ""}`}>
      <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Other information</div>
      <div className="pt-5">
        <div>
          <div className={labelClass}>
            Currencies
            <span className={requiredMarkClass} aria-hidden="true">
              *
            </span>
            <span className={requiredSrOnlyClass}>Required</span>
          </div>
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
      </div>
    </section>
  );
};

export default OtherInfoSection;
