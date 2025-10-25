import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useWatch } from "react-hook-form";

import type { CurrencyCode } from "@/lib/types";

import { currencyMetaByCode, inputClass, inputErrorClass, labelClass, sectionClass, errorTextClass } from "./constants";
import type { InvoiceFormContext } from "./formTypes";
import type { InvoiceFormValues } from "./schema";
import { createItemId, sanitizeNumber } from "./utils";

type ProjectItemsSectionProps = {
  form: Pick<InvoiceFormContext, "register" | "control" | "formState">;
  className?: string;
};

const ProjectItemsSection: React.FC<ProjectItemsSectionProps> = ({ form, className }) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watching the entire array keeps the implementation simple; consider field-level controllers
  // if this section becomes a performance hotspot with many rows.
  const itemsList = useWatch({ control, name: "items" }) as InvoiceFormValues["items"];
  const selectedCurrency = useWatch({ control, name: "currency" }) as CurrencyCode | undefined;
  const currencySymbolValue = useWatch({ control, name: "currencySymbol" }) as string | undefined;

  const currencySymbol =
    // Prefer user-entered symbol, then fall back to metadata so totals remain consistent.
    currencySymbolValue ??
    (selectedCurrency ? currencyMetaByCode[selectedCurrency]?.symbol : undefined) ??
    "$";

  const currencyFormatter = React.useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency ?? "USD",
    });
  }, [selectedCurrency]);

  const handleAddItem = React.useCallback(() => {
    append({ id: createItemId(), description: "", qty: 1, price: 0 });
  }, [append]);

  return (
    <section className={`${sectionClass} overflow-hidden ${className ?? ""}`}>
      <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Project</div>
      <div className="space-y-4 pt-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className={labelClass}>Project items</div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-2 rounded-full border border-brix-blue px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brix-blue transition hover:bg-brix-blue/10"
            >
              <Plus className="h-4 w-4" />
              Add item
            </button>
          </div>
          <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-inner">
            <div className="hidden grid-cols-[minmax(0,3fr)_80px_120px_110px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
              <span>Description</span>
              <span className="text-center">Qty</span>
              <span className="text-center">Price</span>
              <span className="text-right">Total</span>
            </div>
            <div className="divide-y divide-slate-100">
              {fields.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-400">No items yet. Add your first item.</div>
              ) : (
                fields.map((field, index) => {
                  const currentItem = itemsList?.[index];
                  const lineTotal = sanitizeNumber(currentItem?.qty) * sanitizeNumber(currentItem?.price);
                  const itemError = Array.isArray(errors.items) ? errors.items[index] : undefined;
                  const qtyError = itemError?.qty?.message as string | undefined;
                  const priceError = itemError?.price?.message as string | undefined;
                  const qtyErrorId = qtyError ? `items-${index}-qty-error` : undefined;
                  const priceErrorId = priceError ? `items-${index}-price-error` : undefined;
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 items-start gap-4 px-4 py-3 sm:grid-cols-[minmax(0,3fr)_80px_120px_110px] sm:grid-rows-[auto_auto] sm:items-center sm:gap-x-2.5 sm:gap-y-2"
                    >
                      <div className="flex flex-col gap-1 sm:row-start-1 sm:gap-0">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:hidden">
                          Description
                        </span>
                        <input
                          className={`${inputClass} rounded-full`}
                          placeholder="Description"
                          {...register(`items.${index}.description` as const)}
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:row-start-1 sm:gap-0">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:hidden">Qty</span>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          className={`${inputClass} rounded-full text-center ${qtyError ? inputErrorClass : ""}`}
                          placeholder="1"
                          aria-invalid={qtyError ? "true" : "false"}
                          aria-describedby={qtyErrorId}
                          {...register(`items.${index}.qty` as const, {
                            setValueAs: (value) => (value === "" || value === null ? undefined : Number(value)),
                          })}
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:row-start-1 sm:gap-0 sm:items-center">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:hidden">
                          Price
                        </span>
                        <div className="flex items-center gap-2 sm:justify-center">
                          <span className="text-xs font-semibold text-slate-400">{currencySymbol}</span>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            className={`${inputClass} rounded-full ${priceError ? inputErrorClass : ""}`}
                            placeholder="0.00"
                            aria-invalid={priceError ? "true" : "false"}
                            aria-describedby={priceErrorId}
                            {...register(`items.${index}.price` as const, {
                              setValueAs: (value) => (value === "" || value === null ? undefined : Number(value)),
                            })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 sm:row-start-1 sm:gap-0">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:hidden">
                          Total
                        </span>
                        <span className="text-left text-sm font-semibold text-slate-800 sm:text-right">
                          {currencyFormatter.format(lineTotal || 0)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="inline-flex w-max items-center gap-1 rounded-full border border-transparent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 transition hover:border-rose-200 hover:text-rose-500 whitespace-nowrap sm:col-start-1 sm:col-end-2 sm:row-start-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                      {qtyError ? (
                        <span
                          id={qtyErrorId}
                          className={`mt-0 ${errorTextClass} sm:col-start-2 sm:col-end-3 sm:row-start-2`}
                        >
                          {qtyError}
                        </span>
                      ) : null}
                      {priceError ? (
                        <span
                          id={priceErrorId}
                          className={`mt-0 ${errorTextClass} sm:col-start-3 sm:col-end-4 sm:row-start-2`}
                        >
                          {priceError}
                        </span>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectItemsSection;
