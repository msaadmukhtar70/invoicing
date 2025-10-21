import React from "react";
import { useWatch } from "react-hook-form";

import { total } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/types";

import { inputClass, labelClass, sectionClass } from "./constants";
import { sanitizeNumber } from "./utils";
import type { InvoiceFormContext } from "./formTypes";
import type { InvoiceFormValues } from "./schema";

type PriceSectionProps = {
  form: Pick<InvoiceFormContext, "register" | "control">;
  className?: string;
};

const PriceSection: React.FC<PriceSectionProps> = ({ form, className }) => {
  const { register, control } = form;

  const discountRaw = useWatch({ control, name: "discount" }) as number | undefined;
  const taxRaw = useWatch({ control, name: "tax" }) as number | undefined;
  const items = useWatch({ control, name: "items" }) as InvoiceFormValues["items"];
  const selectedCurrency = useWatch({ control, name: "currency" }) as CurrencyCode | undefined;

  const discountValue = sanitizeNumber(discountRaw);
  const taxValue = sanitizeNumber(taxRaw);

  const subtotal = React.useMemo(() => total(items ?? []), [items]);
  const totalDue = React.useMemo(() => subtotal - discountValue + taxValue, [discountValue, subtotal, taxValue]);

  const currencyFormatter = React.useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency ?? "USD",
    });
  }, [selectedCurrency]);

  const pricingRows = React.useMemo(
    () => [
      { label: "Subtotal", value: currencyFormatter.format(subtotal), accent: false },
      { label: "Discount", value: discountValue ? currencyFormatter.format(-discountValue) : currencyFormatter.format(0), accent: false },
      { label: "Tax", value: currencyFormatter.format(taxValue), accent: false },
      { label: "Total due", value: currencyFormatter.format(totalDue), accent: true },
    ],
    [currencyFormatter, discountValue, subtotal, taxValue, totalDue]
  );

  return (
    <section className={`${sectionClass} overflow-hidden ${className ?? ""}`}>
      <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Price</div>
      <div className="space-y-4 pt-5">
        <div>
          <label className={labelClass} htmlFor="discount">
            Discount
          </label>
          <input
            id="discount"
            type="number"
            step="0.01"
            min={0}
            className={`${inputClass} mt-2 rounded-full`}
            {...register("discount", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="tax">
            Tax
          </label>
          <input
            id="tax"
            type="number"
            step="0.01"
            min={0}
            className={`${inputClass} mt-2 rounded-full`}
            {...register("tax", { valueAsNumber: true })}
          />
        </div>
        <div>
          <div className={labelClass}>Summary</div>
          <div className="mt-3 space-y-3">
            {pricingRows.map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ${
                  row.accent ? "border-brix-blue/40" : ""
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.label}</span>
                <span className={`text-sm font-semibold ${row.accent ? "text-brix-blue" : "text-slate-800"}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceSection;
