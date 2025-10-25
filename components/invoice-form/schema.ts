import { z } from "zod";

import { NO_BRAND_COLOR } from "@/lib/colors";
import { gradientOptions } from "@/lib/gradients";
import type { GradientId } from "@/lib/gradients";

import { currencyCodes, hexColorRegExp } from "./constants";

const gradientIdSet = new Set(gradientOptions.map((option) => option.id));
const requiredText = (label: string) => z.string().trim().min(1, { message: `${label} is required` });

const nonNegativeNumber = (label: string) => z.number().min(0, { message: `${label} cannot be negative` });

const optionalNonNegativeNumber = (label: string) => nonNegativeNumber(label).optional();

export const invoiceFormSchema = z.object({
  brandName: requiredText("Brand name"),
  brandLogoDataUrl: z.string().optional(),
  invoiceNumber: requiredText("Invoice number"),
  issuedDate: requiredText("Invoice date"),
  dueDate: requiredText("Payment due date"),
  currency: z.enum(currencyCodes),
  currencySymbol: z.string().optional().transform((value) => value ?? ""),
  brandColor: z
    .string()
    .optional()
    .refine((value) => !value || value === NO_BRAND_COLOR || hexColorRegExp.test(value), {
      message: "Invalid color",
    }),
  from: z.object({
    name: requiredText("Sender name"),
    taxNumber: z.string().optional(),
    address: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
  }),
  to: z.object({
    name: requiredText("Customer name"),
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
      qty: nonNegativeNumber("Quantity"),
      price: nonNegativeNumber("Price"),
    })
  ),
  terms: z.string().optional(),
  discount: optionalNonNegativeNumber("Discount"),
  tax: optionalNonNegativeNumber("Tax"),
  project: z
    .object({
      name: z.string().trim().optional(),
      code: z.string().trim().optional(),
      startDate: z.string().trim().optional(),
      endDate: z.string().trim().optional(),
      notes: z.string().trim().optional(),
    })
    .optional(),
  gradient: z
    .string()
    .optional()
    .refine((value) => !value || gradientIdSet.has(value as GradientId), {
      message: "Invalid gradient selection",
    }),
});

export type InvoiceFormValues = z.input<typeof invoiceFormSchema>;
export type InvoiceFormResolvedValues = z.output<typeof invoiceFormSchema>;
