import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { defaultBrandColor, NO_BRAND_COLOR } from "@/lib/colors";
import { defaultGradientId, gradientOptions } from "@/lib/gradients";
import type { GradientId } from "@/lib/gradients";
import type { Invoice } from "@/lib/types";

import BrandSection from "./invoice-form/BrandSection";
import ClientSection from "./invoice-form/ClientSection";
import CompanySection from "./invoice-form/CompanySection";
import InvoiceDetailsSection from "./invoice-form/InvoiceDetailsSection";
import OtherInfoSection from "./invoice-form/OtherInfoSection";
import PriceSection from "./invoice-form/PriceSection";
import ProjectItemsSection from "./invoice-form/ProjectItemsSection";
import { hexColorRegExp } from "./invoice-form/constants";

const gradientIdSet = new Set(gradientOptions.map((option) => option.id));

const schema = z.object({
  brandName: z.string().min(1),
  brandLogoDataUrl: z.string().optional(),
  invoiceNumber: z.string().min(1),
  issuedDate: z.string().min(1),
  dueDate: z.string().min(1),
  currency: z.enum(["USD", "EUR", "GBP", "JPY", "CHF", "CNY", "MXN", "BTC"]),
  currencySymbol: z.string().optional(),
  brandColor: z
    .string()
    .optional()
    .refine((value) => !value || value === NO_BRAND_COLOR || hexColorRegExp.test(value), { message: "Invalid color" }),
  from: z.object({
    name: z.string().min(1),
    taxNumber: z.string().optional(),
    address: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
  }),
  to: z.object({
    name: z.string().min(1),
    taxNumber: z.string().optional(),
    address: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    photoDataUrl: z.string().optional(),
  }),
  items: z.array(
    z.object({
      id: z.string(),
      description: z.string().min(1).or(z.literal("")),
      qty: z.number().min(0),
      price: z.number().min(0),
    })
  ),
  terms: z.string().optional(),
  discount: z.number().optional(),
  tax: z.number().optional(),
  project: z
    .object({
      name: z.string().optional(),
      code: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  gradient: z
    .string()
    .optional()
    .refine((value) => !value || gradientIdSet.has(value as GradientId), { message: "Invalid gradient selection" }),
});

const cloneInvoice = (invoice: Invoice): Invoice => {
  if (typeof structuredClone === "function") {
    return structuredClone(invoice);
  }

  const cloneUnknown = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => cloneUnknown(item));
    }
    if (value && typeof value === "object") {
      return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, val]) => {
        acc[key] = cloneUnknown(val);
        return acc;
      }, {});
    }
    return value;
  };

  return cloneUnknown(invoice) as Invoice;
};

export default function InvoiceForm({
  initial,
  onChange,
}: {
  initial: Invoice;
  onChange: (inv: Invoice) => void;
}) {
  const form = useForm<Invoice>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      ...initial,
      brandColor: initial.brandColor ?? defaultBrandColor,
      gradient: initial.gradient ?? defaultGradientId,
      project: initial.project ?? { name: "", code: "", startDate: "", endDate: "", notes: "" },
    },
    mode: "onChange",
  });

  const { watch } = form;

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (!value) return;
      onChange(cloneInvoice(value as Invoice));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-4 xl:grid-rows-[repeat(6,minmax(0,auto))]">
        <BrandSection form={form} className="xl:col-start-1 xl:row-start-1 xl:row-span-1" />
        <InvoiceDetailsSection form={form} className="xl:col-start-1 xl:row-start-2 xl:row-span-1" />
        <CompanySection form={form} className="xl:col-start-2 xl:row-start-1 xl:row-span-2" />
        <ClientSection form={form} className="xl:col-start-3 xl:row-start-1 xl:row-span-2" />
        <OtherInfoSection form={form} className="xl:col-start-4 xl:row-start-1 xl:row-span-2" />
        <ProjectItemsSection form={form} className="xl:col-start-2 xl:col-span-2 xl:row-start-3 xl:row-span-2" />
        <PriceSection form={form} className="xl:col-start-4 xl:row-start-3 xl:row-span-2" />
      </div>
    </div>
  );
}
