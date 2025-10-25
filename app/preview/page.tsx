"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import TemplateSwitcher, { TemplateKey } from "@/components/TemplateSwitcher";
import { InvoiceOne, InvoiceTwo, InvoiceThree, InvoiceFour, InvoiceFive } from "@/components/templates";
import { Invoice } from "@/lib/types";
import { loadInvoice, markInvoiceNeedsValidation } from "@/lib/storage";
import { exportNodeToPdf } from "@/lib/pdf";
import { defaultBrandColor, NO_BRAND_COLOR } from "@/lib/colors";
import { defaultGradientId } from "@/lib/gradients";
import type { GradientId } from "@/lib/gradients";
import { invoiceFormSchema } from "@/components/invoice-form/schema";

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
    case "5":
      return <InvoiceFive inv={invoice} />;
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
  const router = useRouter();
  const [template, setTemplate] = React.useState<TemplateKey>("1");
  const [exporting, setExporting] = React.useState(false);
  const [invoice, setInvoice] = React.useState<Invoice | null>(null);

  const baseButton =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-[0.99]";
  const secondaryButton = `${baseButton} border border-slate-200 bg-white/90 text-slate-700 hover:bg-white`;
  const primaryButton = `${baseButton} border border-brix-blue bg-brix-blue text-white hover:bg-brix-blue/90 disabled:cursor-not-allowed disabled:opacity-70`;

  React.useEffect(() => {
    const stored = loadInvoice();
    if (!stored) {
      markInvoiceNeedsValidation();
      router.replace("/");
      return;
    }

    const parsed = invoiceFormSchema.safeParse(stored);
    if (!parsed.success) {
      markInvoiceNeedsValidation();
      router.replace("/");
      return;
    }

    const normalizedGradient = (stored.gradient ?? defaultGradientId) as GradientId;
    const invoicePayload: Invoice = {
      ...stored,
      brandColor: ensureBrandColor(stored),
      gradient: normalizedGradient,
    };
    setInvoice(invoicePayload);
  }, [router]);

  const downloadPdf = async () => {
    if (!invoice) return;
    setExporting(true);
    try {
      await exportNodeToPdf("invoice-preview", "invoice.pdf");
    } finally {
      setExporting(false);
    }
  };

  if (!invoice) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#F6F8FF] via-white to-[#FEF5F0] pb-16">
        <div className="mx-auto flex min-h-[60vh] max-w-[1360px] items-center justify-center px-4 py-6 md:px-6 md:py-10">
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white/90 px-6 py-4 text-sm font-semibold text-slate-600 shadow-soft">
            <Loader2 className="h-4 w-4 animate-spin text-brix-blue" />
            Preparing preview...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <div className="mx-auto max-w-[1360px] px-4 py-6 md:px-6 md:py-10">
        <div className="mb-6 overflow-hidden rounded-[36px] border border-slate-200/70 bg-white shadow-soft">
          <div className="relative px-6 py-6 md:px-10 md:py-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F6F8FF] via-white to-[#FEF5F0]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 right-4 h-52 w-52 rounded-full bg-brix-blue/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-12 h-48 w-48 rounded-full bg-orange-200/25 blur-3xl"
            />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Invoice Preview</h1>
                <p className="max-w-lg text-sm text-slate-500 md:text-base">
                  Switch templates, fine-tune the layout, and share polished PDFs with your clients.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link className={secondaryButton} href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to editor
                </Link>
                <button className={primaryButton} onClick={downloadPdf} disabled={exporting}>
                  {exporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <aside className="space-y-4">
            <TemplateSwitcher value={template} onChange={setTemplate} />
          </aside>
          <section className="flex justify-start overflow-x-auto overflow-y-visible p-4 md:p-6 lg:justify-center lg:overflow-visible">
            <div id="invoice-preview" data-force-desktop className="invoice-preview-surface shrink-0">
              <TemplateView template={template} invoice={invoice} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
