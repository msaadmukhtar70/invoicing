"use client";
import React from "react";
import { Invoice } from "@/lib/types";
import { MoneyBig, computeTotals, TemplateFrame } from "./TemplateBase";
import { formatMoney } from "@/lib/currency";

const formatDisplayDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const LOGO_ACTIVE_DOTS = new Set([0, 1, 3, 4, 5, 6, 7]);

export default function InvoiceOne({ inv }: { inv: Invoice }) {
  const { sub, grand } = computeTotals(inv);
  const issuedDate = formatDisplayDate(inv.issuedDate);
  const dueDate = formatDisplayDate(inv.dueDate);
  const brandName = inv.brandName?.trim();
  const hasBrandName = Boolean(brandName);
  const brandTitle = hasBrandName ? brandName! : "";
  const agencyName = inv.from.name?.trim() || "";
  const secondaryId = inv.from.taxNumber?.trim() || inv.from.registrationId?.trim() || "";
  const brandLogoUrl = inv.brandLogoDataUrl?.trim();
  const showAgencyLine = Boolean(agencyName || secondaryId);
  const brandLogoAlt = brandTitle || agencyName ? `${brandTitle || agencyName} logo` : "Brand logo";

  return (
    <TemplateFrame inv={inv} className="mx-auto max-w-[960px] p-6 md:p-8 lg:p-12">
      <div className="space-y-10">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <div
              className="relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-[32px] bg-[var(--brand-color)] p-9 text-white"
              style={{
                background: "linear-gradient(140deg, var(--brand-color), var(--brand-color-light))",
              }}
            >
              <div className="pointer-events-none absolute inset-0">
                <div
                  className="absolute -left-20 bottom-[-70px] h-52 w-52 rounded-full opacity-40"
                  style={{ background: "var(--brand-color-light)" }}
                />
                <div
                  className="absolute -bottom-36 right-[-80px] h-72 w-72 rounded-full opacity-25"
                  style={{ background: "var(--brand-color-lighter)" }}
                />
                <div
                  className="absolute -top-16 right-[-24px] h-44 w-44 rounded-full opacity-30"
                  style={{ background: "var(--brand-color-light)" }}
                />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-transparent p-0">
                    {brandLogoUrl ? (
                      <img src={brandLogoUrl} alt={brandLogoAlt} className="h-full w-full object-contain" />
                    ) : (
                      <div className="grid h-full w-full grid-cols-3 gap-3 rounded-3xl bg-white/10 p-2 backdrop-blur-sm">
                        {Array.from({ length: 9 }).map((_, index) => (
                          <span
                            key={index}
                            className={`h-4 w-4 rounded-full ${LOGO_ACTIVE_DOTS.has(index) ? "bg-white" : "bg-white/0"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {hasBrandName && (
                    <div className="text-[38px] font-extrabold leading-none tracking-tight text-white">{brandTitle}</div>
                  )}
                </div>
                {showAgencyLine && (
                  <div className="text-sm font-semibold text-white/80">
                    {agencyName && <span className="font-semibold text-white">{agencyName}</span>}
                    {agencyName && secondaryId && <span className="mx-2 text-white/60">/</span>}
                    {secondaryId && <span className="font-medium text-white/70">{secondaryId}</span>}
                  </div>
                )}
              </div>
              {inv.invoiceNumber && (
                <div className="relative z-10 text-xs font-semibold uppercase tracking-[0.54em] text-white/60">
                  Invoice No. {inv.invoiceNumber}
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col md:w-80">
            <div className="rounded-[32px] bg-[#f1f4ff] p-6">
              <div
                className="rounded-[26px] bg-white p-6 text-left"
                style={{ boxShadow: "0px 2px 8px 3px rgba(0,0,0,0.05)" }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">
                  Amount Due
                </div>
                <div className="mt-4">
                  <MoneyBig value={grand} inv={inv} />
                </div>
                {dueDate && <div className="mt-2 text-sm text-slate-400">{dueDate}</div>}
              </div>
              <div className="mt-7 text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">
                Invoice To:
              </div>
              <div className="mt-3 text-lg font-semibold text-slate-800">{inv.to.name}</div>
              {inv.to.phone && <div className="text-sm text-slate-500">{inv.to.phone}</div>}
              {inv.to.address && <div className="text-sm leading-relaxed text-slate-500">{inv.to.address}</div>}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Invoice details
          </div>
          <div
            className="mt-4 grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 md:grid-cols-3"
            style={{ boxShadow: "0px 2px 8px 3px rgba(0,0,0,0.05)" }}
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Invoice number</div>
              <div className="mt-1 text-base font-semibold text-slate-800">No.: {inv.invoiceNumber || "--"}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Issued</div>
              <div className="mt-1 text-base font-semibold text-slate-800">{issuedDate || "--"}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Due date</div>
              <div className="mt-1 text-base font-semibold text-slate-800">{dueDate || "--"}</div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="py-4 pl-6 pr-4 text-left font-semibold text-slate-500">Description</th>
                <th className="px-4 py-4 text-right font-semibold text-slate-500">Qty</th>
                <th className="px-4 py-4 text-right font-semibold text-slate-500">Price</th>
                <th className="py-4 pl-4 pr-6 text-right font-semibold text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {inv.items.map((it, index) => (
                <tr
                  key={it.id}
                  className={`text-slate-600 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                >
                  <td className="py-4 pl-6 pr-4 text-base text-slate-700">{it.description}</td>
                  <td className="px-4 py-4 text-right">{it.qty}</td>
                  <td className="px-4 py-4 text-right">
                    {formatMoney(it.price, inv.currency, inv.currencySymbol)}
                  </td>
                  <td className="py-4 pl-4 pr-6 text-right font-semibold text-slate-800">
                    {formatMoney(it.qty * it.price, inv.currency, inv.currencySymbol)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <div className="flex-1 rounded-[28px] border border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-600 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Terms & Conditions</div>
            <p className="mt-3 leading-relaxed">{inv.terms}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-right shadow-soft md:w-72">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Total amount</div>
            <div className="mt-4">
              <MoneyBig value={grand} inv={inv} />
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-500">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatMoney(sub, inv.currency, inv.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Discount</span>
                <span>{formatMoney(inv.discount || 0, inv.currency, inv.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span>{formatMoney(inv.tax || 0, inv.currency, inv.currencySymbol)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TemplateFrame>
  );
}
