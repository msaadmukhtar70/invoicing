import { Invoice } from "./types";

const INVOICE_KEY = "brix-invoice";
const VALIDATION_FLAG_KEY = "brix-invoice:force-validate";

export function saveInvoice(inv: Invoice) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INVOICE_KEY, JSON.stringify(inv));
}

export function loadInvoice(): Invoice | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(INVOICE_KEY);
  return raw ? (JSON.parse(raw) as Invoice) : null;
}

export function markInvoiceNeedsValidation() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(VALIDATION_FLAG_KEY, "true");
}

export function consumeInvoiceValidationFlag(): boolean {
  if (typeof window === "undefined") return false;
  const stored = sessionStorage.getItem(VALIDATION_FLAG_KEY);
  if (stored) {
    sessionStorage.removeItem(VALIDATION_FLAG_KEY);
    return true;
  }
  return false;
}
