import type { GradientId } from "./gradients";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CHF" | "CNY" | "MXN" | "BTC";

export interface CompanyInfo {
  name: string;
  taxNumber?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface ClientInfo {
  name: string;
  taxNumber?: string;
  address?: string;
  email?: string;
  phone?: string;
  photoDataUrl?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

export interface ProjectInfo {
  name?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface Invoice {
  brandName: string;
  brandLogoDataUrl?: string;
  brandColor?: string;
  invoiceNumber: string;
  issuedDate: string; // ISO
  dueDate: string; // ISO
  currency: CurrencyCode;
  currencySymbol: string;
  from: CompanyInfo;
  to: ClientInfo;
  items: InvoiceItem[];
  terms?: string;
  discount?: number; // absolute
  tax?: number; // absolute
  project?: ProjectInfo;
  gradient?: GradientId;
}

