import { Invoice } from "./types";

const KEY = "brix-invoice";

export function saveInvoice(inv: Invoice) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(inv));
}

export function loadInvoice(): Invoice | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as Invoice : null;
}
