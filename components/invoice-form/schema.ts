import { z } from "zod";

import { NO_BRAND_COLOR } from "@/lib/colors";
import { gradientOptions } from "@/lib/gradients";
import type { GradientId } from "@/lib/gradients";

import { currencyCodes, hexColorRegExp } from "./constants";

const gradientIdSet = new Set(gradientOptions.map((option) => option.id));

export const invoiceFormSchema = z.object({
  brandName: z.string().min(1),
  brandLogoDataUrl: z.string().optional(),
  invoiceNumber: z.string().min(1),
  issuedDate: z.string().min(1),
  dueDate: z.string().min(1),
  currency: z.enum(currencyCodes),
  currencySymbol: z.string().optional().transform((value) => value ?? ""),
  brandColor: z
    .string()
    .optional()
    .refine((value) => !value || value === NO_BRAND_COLOR || hexColorRegExp.test(value), {
      message: "Invalid color",
    }),
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
    .refine((value) => !value || gradientIdSet.has(value as GradientId), {
      message: "Invalid gradient selection",
    }),
});

export type InvoiceFormValues = z.input<typeof invoiceFormSchema>;
export type InvoiceFormResolvedValues = z.output<typeof invoiceFormSchema>;
