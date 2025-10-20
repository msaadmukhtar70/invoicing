"use client";
import React from "react";
import { Invoice } from "@/lib/types";
import { MoneyBig, computeTotals, TemplateFrame } from "./TemplateBase";
import { formatMoney } from "@/lib/currency";

export default function InvoiceFour({ inv }: { inv: Invoice }) {
  const { grand } = computeTotals(inv);
  return (
    <TemplateFrame inv={inv} className="p-8 max-w-[900px] mx-auto space-y-6">
      <div className="grid gap-6 md:grid-cols-3 md:items-center">
        <div>
          <div className="text-3xl font-black">{inv.from.name}</div>
          {inv.from.taxNumber && <div className="text-slate-500">{inv.from.taxNumber}</div>}
        </div>
        <div className="card bg-white/85 p-4">
          <div className="text-xs text-slate-500">Invoice to</div>
          <div className="font-semibold">{inv.to.name}</div>
          <div className="text-sm text-slate-500">{inv.to.address}</div>
          <div className="text-sm text-slate-500">{inv.to.email}</div>
        </div>
        <div className="card bg-white/85 p-4">
          <div className="text-xs text-slate-500">Amount due</div>
          <MoneyBig value={grand} inv={inv} />
          <div className="text-xs text-slate-500 mt-2">Due date</div>
          <div className="font-medium">{new Date(inv.dueDate).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-600">
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {inv.items.map((it) => (
              <tr key={it.id}>
                <td className="p-3">{it.description}</td>
                <td className="p-3 text-right">{it.qty}</td>
                <td className="p-3 text-right">{formatMoney(it.price, inv.currency, inv.currencySymbol)}</td>
                <td className="p-3 text-right font-medium">{formatMoney(it.qty * it.price, inv.currency, inv.currencySymbol)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="text-right">
          <div className="text-sm text-slate-500">Total amount</div>
          <MoneyBig value={grand} inv={inv} />
        </div>
      </div>

      <div className="text-sm text-slate-500">
        <div className="font-semibold text-slate-800 mb-1">Terms & Conditions</div>
        <p>{inv.terms}</p>
      </div>
    </TemplateFrame>
  );
}
