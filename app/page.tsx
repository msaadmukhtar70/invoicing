"use client";
import React from "react";
import { PenSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import InvoiceForm, { InvoiceFormHandle } from "@/components/InvoiceForm";
import { Invoice } from "@/lib/types";
import { createEmptyInvoice } from "@/lib/sampleData";
import { loadInvoice, saveInvoice } from "@/lib/storage";
import { defaultGradientId } from "@/lib/gradients";
import { defaultBrandColor, NO_BRAND_COLOR } from "@/lib/colors";

const ensureBrandColor = (invoice: Invoice) => {
  const hasBrandColor = Object.prototype.hasOwnProperty.call(invoice, "brandColor");
  if (!hasBrandColor) {
    return defaultBrandColor;
  }
  return typeof invoice.brandColor === "string" ? invoice.brandColor : NO_BRAND_COLOR;
};

export default function HomePage() {
  const [invoice, setInvoice] = React.useState<Invoice>(() => createEmptyInvoice());
  const [formEpoch, setFormEpoch] = React.useState(0);
  const invoiceFormRef = React.useRef<InvoiceFormHandle>(null);
  const router = useRouter();
  const hasHydrated = React.useRef(false);

  const baseButton =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-[0.99]";
  const secondaryButton = `${baseButton} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`;
  const primaryButton = `${baseButton} border border-brix-blue bg-brix-blue text-white hover:bg-brix-blue/90`;

  React.useEffect(() => {
    const stored = loadInvoice();
    if (stored) {
      setInvoice({
        ...stored,
        brandColor: ensureBrandColor(stored),
        gradient: stored.gradient ?? defaultGradientId,
      });
      setFormEpoch((prev) => prev + 1);
    }
  }, []);

  React.useEffect(() => {
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      return;
    }
    saveInvoice(invoice);
  }, [invoice]);

  const importJson = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      setInvoice({
        ...parsed,
        brandColor: ensureBrandColor(parsed),
        gradient: parsed.gradient ?? defaultGradientId,
      });
      setFormEpoch((prev) => prev + 1);
    };
    input.click();
  };

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(invoice, null, 2));
    const anchor = document.createElement("a");
    anchor.href = dataStr;
    anchor.download = "invoice.json";
    anchor.click();
  };

  const resetInvoice = () => {
    setInvoice(createEmptyInvoice());
    setFormEpoch((prev) => prev + 1);
  };

  const handleOpenPreview = React.useCallback(async () => {
    const isValid = await invoiceFormRef.current?.validate();
    if (isValid) {
      router.push("/preview");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F6F8FF] via-white to-[#FEF5F0] pb-16">
      <div className="mx-auto w-full max-w-[1360px] px-4 py-6 md:px-6 md:py-10">
        <div className="mb-8">
          <div className="rounded-[36px] border border-slate-200/70 bg-white shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="flex flex-1 items-center gap-3 md:gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brix-blue text-white shadow-brix">
                  <PenSquare className="h-4 w-4" />
                </span>
                <h1 className="text-xl font-semibold text-slate-800 md:text-2xl">Edition Panel</h1>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
                <button className={secondaryButton} onClick={importJson}>
                  Import JSON
                </button>
                <button className={secondaryButton} onClick={exportJson}>
                  Export JSON
                </button>
                <button className={secondaryButton} onClick={resetInvoice}>
                  Reset
                </button>
                <button type="button" className={primaryButton} onClick={handleOpenPreview}>
                  Open preview
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-white/90 p-4 shadow-soft sm:p-6 md:p-8">
          <div className="pointer-events-none absolute inset-x-6 top-6 h-24 rounded-[28px] bg-gradient-to-b from-slate-100/80 to-transparent" />
          <div className="relative z-10">
            <InvoiceForm ref={invoiceFormRef} key={formEpoch} initial={invoice} onChange={setInvoice} />
          </div>
        </div>
      </div>
    </main>
  );
}
