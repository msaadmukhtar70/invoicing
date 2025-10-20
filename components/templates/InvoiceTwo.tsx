"use client";
import React from "react";
import { Invoice } from "@/lib/types";
import { HeaderLogo, MoneyBig, computeTotals, TemplateFrame } from "./TemplateBase";
import { formatMoney } from "@/lib/currency";

export default function InvoiceTwo({ inv }: { inv: Invoice }) {
  const { grand } = computeTotals(inv);
  return (
    <TemplateFrame inv={inv} className="p-8 max-w-[900px] mx-auto">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_80%_-50%,rgba(255,87,34,0.12),transparent)] opacity-80" />
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between gap-6">
          <HeaderLogo inv={inv} />
          <div
            className="rounded-2xl px-6 py-4 text-white"
            style={{
              background: "linear-gradient(135deg, var(--brand-color), var(--brand-color-light))",
              boxShadow: `0 14px 32px var(--brand-color-shadow)`,
            }}
          >
            <div className="text-xs opacity-85">Total amount</div>
            <div className="text-3xl font-extrabold text-white">
              {formatMoney(grand, inv.currency, inv.currencySymbol)}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card bg-white/70 p-4">
            <div className="text-xs text-slate-500">Invoice to</div>
            <div className="font-semibold">{inv.to.name}</div>
            <div className="text-sm text-slate-500">{inv.to.email}</div>
            <div className="text-sm text-slate-500">{inv.to.address}</div>
          </div>
          <div className="card bg-white/70 p-4">
            <div className="text-xs text-slate-500">Invoice number</div>
            <div className="font-medium">No. {inv.invoiceNumber}</div>
            <div className="text-xs text-slate-500 mt-4">Issued</div>
            <div className="font-medium">{new Date(inv.issuedDate).toLocaleDateString()}</div>
          </div>
          <div className="card bg-white/70 p-4">
            <div className="text-xs text-slate-500">Due date</div>
            <div className="font-medium">{new Date(inv.dueDate).toLocaleDateString()}</div>
            <div className="text-xs text-slate-500 mt-4">Currency</div>
            <div className="font-medium">{inv.currency}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-slate-600">
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {inv.items.map((it) => (
                  <tr key={it.id}>
                    <td className="p-3">{it.description}</td>
                    <td className="p-3 text-center">{it.qty}</td>
                    <td className="p-3 text-right">{formatMoney(it.price, inv.currency, inv.currencySymbol)}</td>
                    <td className="p-3 text-right font-medium">{formatMoney(it.qty * it.price, inv.currency, inv.currencySymbol)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <div className="rounded-2xl bg-white border border-slate-200 p-4 w-full md:w-80">
              <div className="flex justify-between py-2 text-lg">
                <span className="text-slate-500">Grand total</span>
                <MoneyBig value={grand} inv={inv} />
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          <div className="font-semibold text-slate-800 mb-1">Terms & Conditions</div>
          <p>{inv.terms}</p>
        </div>
      </div>
    </TemplateFrame>
  );
}
