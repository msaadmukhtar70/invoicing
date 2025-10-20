"use client";
import React from "react";
import Link from "next/link";
import TemplateSwitcher, { TemplateKey } from "@/components/TemplateSwitcher";
import { InvoiceOne, InvoiceTwo, InvoiceThree, InvoiceFour } from "@/components/templates";
import { Invoice } from "@/lib/types";
import { loadInvoice } from "@/lib/storage";
import { sampleInvoice } from "@/lib/sampleData";
import { exportNodeToPdf } from "@/lib/pdf";
import { defaultBrandColor, NO_BRAND_COLOR } from "@/lib/colors";
import { resolveGradient, defaultGradientId } from "@/lib/gradients";

function TemplateView({ invoice, template }: { invoice: Invoice; template: TemplateKey }) {
  switch (template) {
    case "1":
      return <InvoiceOne inv={invoice} />;
    case "2":
      return <InvoiceTwo inv={invoice} />;
    case "3":
      return <InvoiceThree inv={invoice} />;
    case "4":
      return <InvoiceFour inv={invoice} />;
    default:
      return <InvoiceOne inv={invoice} />;
  }
}

const ensureBrandColor = (invoice: Invoice) => {
  const hasBrandColor = Object.prototype.hasOwnProperty.call(invoice, "brandColor");
  if (!hasBrandColor) {
    return defaultBrandColor;
  }
  return typeof invoice.brandColor === "string" ? invoice.brandColor : NO_BRAND_COLOR;
};

export default function PreviewPage() {
  const [template, setTemplate] = React.useState<TemplateKey>("1");
  const [exporting, setExporting] = React.useState(false);
  const [invoice, setInvoice] = React.useState<Invoice>(sampleInvoice);

  React.useEffect(() => {
    const stored = loadInvoice();
    if (stored) {
      setInvoice({
        ...stored,
        brandColor: ensureBrandColor(stored),
        gradient: stored.gradient ?? defaultGradientId,
      });
    }
  }, []);

  const downloadPdf = async () => {
    setExporting(true);
    try {
      await exportNodeToPdf("invoice-preview", "invoice.pdf");
    } finally {
      setExporting(false);
    }
  };

  const currentGradient = resolveGradient(invoice.gradient);

  return (
    <main className="min-h-screen pb-16">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Invoice Preview</h1>
            <p className="text-sm text-slate-500">Switch templates, check the layout and export your PDF.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link className="btn" href="/">
              Back to editor
            </Link>
            <button className="btn-primary" onClick={downloadPdf} disabled={exporting}>
              {exporting ? "Exporting..." : "Download PDF"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <aside className="space-y-4">
            <TemplateSwitcher value={template} onChange={setTemplate} />
          </aside>
          <section className="card p-4 md:p-6">
            <div
              id="invoice-preview"
              className={`overflow-auto rounded-3xl p-4 transition-colors md:p-6 ${currentGradient.backgroundClass}`}
            >
              <div className="rounded-[32px] bg-white p-4 shadow-soft md:p-6">
                <TemplateView template={template} invoice={invoice} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
