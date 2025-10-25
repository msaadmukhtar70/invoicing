import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import rfdc from "rfdc";

import { defaultBrandColor } from "@/lib/colors";
import { defaultGradientId } from "@/lib/gradients";
import type { Invoice } from "@/lib/types";

import BrandSection from "./invoice-form/BrandSection";
import ClientSection from "./invoice-form/ClientSection";
import CompanySection from "./invoice-form/CompanySection";
import InvoiceDetailsSection from "./invoice-form/InvoiceDetailsSection";
import OtherInfoSection from "./invoice-form/OtherInfoSection";
import PriceSection from "./invoice-form/PriceSection";
import ProjectItemsSection from "./invoice-form/ProjectItemsSection";
import type { InvoiceFormResolvedValues, InvoiceFormValues } from "./invoice-form/schema";
import { invoiceFormSchema } from "./invoice-form/schema";

const fallbackClone = rfdc();

export type InvoiceFormHandle = {
  validate: () => Promise<boolean>;
};

type InvoiceFormProps = {
  initial: Invoice;
  onChange: (inv: Invoice) => void;
};

function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return fallbackClone(value);
}

// Align loosely typed form values with the stricter persisted Invoice shape.
const toInvoice = (values: InvoiceFormValues): Invoice => ({
  ...values,
  currencySymbol: values.currencySymbol ?? "",
}) as Invoice;

const InvoiceForm = React.forwardRef<InvoiceFormHandle, InvoiceFormProps>(function InvoiceForm(
  { initial, onChange },
  ref
) {
  // Centralize defaults so the form starts from a predictable baseline.
  const defaultValues: InvoiceFormValues = {
    ...initial,
    brandColor: initial.brandColor ?? defaultBrandColor,
    gradient: initial.gradient ?? defaultGradientId,
    project: initial.project ?? { name: "", code: "", startDate: "", endDate: "", notes: "" },
    currencySymbol: initial.currencySymbol ?? "",
  };

  const form = useForm<InvoiceFormValues, undefined, InvoiceFormResolvedValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { watch, getValues } = form;

  React.useImperativeHandle(
    ref,
    () => ({
      validate: async () => {
        const isValid = await form.trigger(undefined, { shouldFocus: true });
        return isValid;
      },
    }),
    [form]
  );

  React.useEffect(() => {
    // Subscribe to value changes and emit a safe copy upstream.
    const subscription = watch(() => {
      const current = getValues();
      onChange(deepClone(toInvoice(current)));
    });
    return () => subscription.unsubscribe();
  }, [getValues, watch, onChange]);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-4 xl:grid-rows-[repeat(6,minmax(0,auto))]">
        <BrandSection form={form} className="xl:col-start-1 xl:row-start-1 xl:row-span-2" />
        <InvoiceDetailsSection form={form} className="xl:col-start-1 xl:row-start-3 xl:row-span-1" />
        <CompanySection form={form} className="xl:col-start-2 xl:row-start-1 xl:row-span-2" />
        <ClientSection form={form} className="xl:col-start-3 xl:row-start-1 xl:row-span-2" />
        <OtherInfoSection form={form} className="xl:col-start-4 xl:row-start-1 xl:row-span-1" />
        <ProjectItemsSection form={form} className="xl:col-start-2 xl:col-span-2 xl:row-start-3 xl:row-span-2" />
        <PriceSection form={form} className="xl:col-start-4 xl:row-start-2 xl:row-span-1" />
      </div>
    </div>
  );
});

export default InvoiceForm;
