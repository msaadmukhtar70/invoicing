"use client";
import React from "react";
import { Invoice } from "@/lib/types";
import { HeaderLogo, MoneyBig, computeTotals, TemplateFrame } from "./TemplateBase";
import { formatMoney } from "@/lib/currency";

export default function InvoiceThree({ inv }: { inv: Invoice }) {
  const { sub, grand } = computeTotals(inv);
  return (
    <TemplateFrame inv={inv} className="p-8 max-w-[900px] mx-auto space-y-6">
      <div className="grid items-start gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <HeaderLogo inv={inv} />
          <div className="text-slate-500">{inv.from.name}</div>
        </div>
        <div className="justify-self-end">
          <div className="rounded-2xl bg-white/90 border border-slate-200 p-4 shadow-soft">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-slate-500">Invoice number</div>
                <div className="font-medium">No. {inv.invoiceNumber}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Issued</div>
                <div className="font-medium">{new Date(inv.issuedDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Due date</div>
                <div className="font-medium">{new Date(inv.dueDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Currency</div>
                <div className="font-medium">{inv.currency}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card bg-white/80 p-4">
          <div className="text-xs text-slate-500">Bill to:</div>
          <div className="font-semibold">{inv.to.name}</div>
          <div className="text-sm text-slate-500">{inv.to.email}</div>
          <div className="text-sm text-slate-500">{inv.to.address}</div>
        </div>
        <div className="card bg-white/80 p-4">
          <div className="text-xs text-slate-500">Bill from:</div>
          <div className="font-semibold">{inv.from.name}</div>
          <div className="text-sm text-slate-500">{inv.from.phone}</div>
          <div className="text-sm text-slate-500">{inv.from.address}</div>
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

      <div className="flex flex-col items-end gap-4 md:flex-row md:items-end">
        <div className="flex-1" />
        <div className="rounded-2xl bg-white border border-slate-200 p-4 w-full md:w-80">
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium">{formatMoney(sub, inv.currency, inv.currencySymbol)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Discount</span>
            <span className="font-medium">{formatMoney(inv.discount || 0, inv.currency, inv.currencySymbol)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Tax</span>
            <span className="font-medium">{formatMoney(inv.tax || 0, inv.currency, inv.currencySymbol)}</span>
          </div>
          <div className="border-t mt-2 pt-3 flex justify-between items-center">
            <div className="text-sm text-slate-500">Total amount</div>
            <MoneyBig value={grand} inv={inv} />
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-500">
        <div className="font-semibold text-slate-800 mb-1">Terms & Conditions</div>
        <p>{inv.terms}</p>
      </div>
    </TemplateFrame>
  );
}
