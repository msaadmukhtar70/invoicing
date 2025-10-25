"use client";
import React from "react";
import { Invoice } from "@/lib/types";
import { formatMoney } from "@/lib/currency";
import { MoneyBig, TemplateFrame, computeTotals, HeaderLogo } from "./TemplateBase";

const formatDisplayDate = (value?: string) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function InvoiceFive({ inv }: { inv: Invoice }) {
  const { sub, grand } = computeTotals(inv);
  const issuedDate = formatDisplayDate(inv.issuedDate);
  const dueDate = formatDisplayDate(inv.dueDate);
  const discount = inv.discount ?? 0;
  const tax = inv.tax ?? 0;
  const hasDiscount = discount > 0;
  const hasTax = tax > 0;
  const notes = inv.terms ?? "";

  return (
    <TemplateFrame inv={inv} className="mx-auto max-w-[860px] space-y-8 px-8 py-10">
      <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
        <HeaderLogo inv={inv} />
        <div className="grid gap-2 text-sm text-slate-500 md:text-right">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Invoice</div>
          <div className="text-lg font-semibold text-slate-800">#{inv.invoiceNumber || "--"}</div>
          <dl className="grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1">
            <dt>Issued</dt>
            <dd className="font-medium text-slate-700">{issuedDate}</dd>
            <dt>Due</dt>
            <dd className="font-medium text-slate-700">{dueDate}</dd>
          </dl>
        </div>
      </header>

      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-600 md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">From</div>
          <div className="mt-2 text-base font-semibold text-slate-800">{inv.from.name}</div>
          {inv.from.address && <div className="mt-1">{inv.from.address}</div>}
          <div className="mt-2 space-y-1">
            {inv.from.email && <div>Email: {inv.from.email}</div>}
            {inv.from.phone && <div>Phone: {inv.from.phone}</div>}
            {inv.from.taxNumber && <div>Tax ID: {inv.from.taxNumber}</div>}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Bill To</div>
          <div className="mt-2 text-base font-semibold text-slate-800">{inv.to.name}</div>
          {inv.to.address && <div className="mt-1">{inv.to.address}</div>}
          <div className="mt-2 space-y-1">
            {inv.to.email && <div>Email: {inv.to.email}</div>}
            {inv.to.phone && <div>Phone: {inv.to.phone}</div>}
            {inv.to.taxNumber && <div>Tax ID: {inv.to.taxNumber}</div>}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="h-1 w-full bg-[var(--brand-color)]" />
        <table className="w-full text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-4 text-left">Description</th>
              <th className="px-5 py-4 text-right">Qty</th>
              <th className="px-5 py-4 text-right">Rate</th>
              <th className="px-5 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {inv.items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3 font-medium text-slate-700">{item.description}</td>
                <td className="px-5 py-3 text-right">{item.qty}</td>
                <td className="px-5 py-3 text-right">
                  {formatMoney(item.price, inv.currency, inv.currencySymbol)}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-slate-800">
                  {formatMoney(item.qty * item.price, inv.currency, inv.currencySymbol)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-sm text-slate-600 md:max-w-[55%]">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Notes</div>
          <p className="mt-3 leading-relaxed">{notes}</p>
        </div>
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Summary</div>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatMoney(sub, inv.currency, inv.currencySymbol)}</dd>
            </div>
            {hasDiscount && (
              <div className="flex justify-between">
                <dt>Discount</dt>
                <dd>-{formatMoney(discount, inv.currency, inv.currencySymbol)}</dd>
              </div>
            )}
            {hasTax && (
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd>{formatMoney(tax, inv.currency, inv.currencySymbol)}</dd>
              </div>
            )}
          </dl>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Amount Due</div>
            <div className="mt-3">
              <MoneyBig value={grand} inv={inv} />
            </div>
            <div className="mt-2 text-sm text-slate-500">Due by {dueDate}</div>
          </div>
        </div>
      </section>
    </TemplateFrame>
  );
}
