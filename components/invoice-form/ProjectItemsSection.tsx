import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn, useFieldArray, useWatch } from "react-hook-form";

import type { CurrencyCode, Invoice } from "@/lib/types";

import { currencyMetaByCode, inputClass, labelClass, sectionClass } from "./constants";
import { createItemId, sanitizeNumber } from "./utils";

type ProjectItemsSectionProps = {
  form: Pick<UseFormReturn<Invoice>, "register" | "control">;
  className?: string;
};

const ProjectItemsSection: React.FC<ProjectItemsSectionProps> = ({ form, className }) => {
  const { register, control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const itemsList = useWatch({ control, name: "items" }) as Invoice["items"];
  const selectedCurrency = useWatch({ control, name: "currency" }) as CurrencyCode | undefined;
  const currencySymbolValue = useWatch({ control, name: "currencySymbol" }) as string | undefined;

  const currencySymbol =
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
            <div className="grid grid-cols-[minmax(0,3fr)_80px_120px_110px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-[minmax(0,3fr)_80px_120px_110px] grid-rows-[auto_auto] items-center gap-x-2.5 gap-y-2 px-4 py-3"
                    >
                      <input
                        className={`${inputClass} rounded-full row-start-1`}
                        placeholder="Description"
                        {...register(`items.${index}.description` as const)}
                      />
                      <input
                        type="number"
                        min={0}
                        step={1}
                        className={`${inputClass} rounded-full text-center row-start-1`}
                        {...register(`items.${index}.qty` as const, { valueAsNumber: true })}
                      />
                      <div className="row-start-1 flex items-center justify-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">{currencySymbol}</span>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          className={`${inputClass} rounded-full`}
                          {...register(`items.${index}.price` as const, { valueAsNumber: true })}
                        />
                      </div>
                      <span className="row-start-1 text-right text-sm font-semibold text-slate-800">
                        {currencyFormatter.format(lineTotal || 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="col-start-1 col-end-2 row-start-2 inline-flex w-max items-center gap-1 rounded-full border border-transparent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 transition hover:border-rose-200 hover:text-rose-500 whitespace-nowrap"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
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
