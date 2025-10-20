"use client";
import React from "react";
import { useFieldArray, Control } from "react-hook-form";
import { v4 as uuid } from "uuid";

export default function LineItemsTable({ control, register, watch }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  React.useEffect(() => {
    if (fields.length === 0) {
      append({ id: uuid(), description: "", qty: 1, price: 0 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = () => append({ id: uuid(), description: "", qty: 1, price: 0 });

  return (
    <div className="space-y-2">
      <label className="label">Items & Services</label>
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Description</th>
              <th className="text-right p-3 w-24">Qty</th>
              <th className="text-right p-3 w-32">Price</th>
              <th className="text-right p-3 w-32">Total</th>
              <th className="p-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {fields.map((f, i) => (
              <tr key={f.id}>
                <td className="p-3">
                  <input {...register(`items.${i}.description`)} className="input" placeholder="Describe the work..." />
                </td>
                <td className="p-3">
                  <input type="number" step="1" min="0" {...register(`items.${i}.qty`, { valueAsNumber: true })} className="input text-right" />
                </td>
                <td className="p-3">
                  <input type="number" step="0.01" min="0" {...register(`items.${i}.price`, { valueAsNumber: true })} className="input text-right" />
                </td>
                <td className="p-3 text-right">
                  {((watch(`items.${i}.qty`) || 0) * (watch(`items.${i}.price`) || 0)).toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  <button type="button" className="text-slate-500 hover:text-rose-600" onClick={() => remove(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button type="button" className="btn" onClick={add}>Add item</button>
      </div>
    </div>
  );
}
