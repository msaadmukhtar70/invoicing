import type { UseFormReturn } from "react-hook-form";

import type { InvoiceFormResolvedValues, InvoiceFormValues } from "./schema";

export type InvoiceFormContext = UseFormReturn<
  InvoiceFormValues,
  undefined,
  InvoiceFormResolvedValues
>;
