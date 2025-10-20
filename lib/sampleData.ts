import { Invoice } from "./types";
import { defaultGradientId } from "./gradients";
import { defaultBrandColor } from "./colors";
import { currencySymbols } from "./currency";

export const sampleInvoice: Invoice = {
  brandName: "brix",
  brandLogoDataUrl: "",
  brandColor: defaultBrandColor,
  invoiceNumber: "000027",
  issuedDate: "2024-06-26",
  dueDate: "2024-07-26",
  currency: "USD",
  currencySymbol: "$",
  from: {
    name: "BRIX Agency",
    taxNumber: "12345 6789 US0001",
    address: "Pablo Alto, San Francisco, CA 94109, United States of America",
    email: "contact@brixagency.com",
    phone: "(684) 879 - 0102",
    website: "www.brixagency.com"
  },
  to: {
    name: "Mauro Sicard",
    taxNumber: "12345 6789 GB0001",
    address: "Pablo Alto, San Francisco, CA 92102, United States of America",
    email: "contact@maurosicard.com",
    phone: "(612) 856 - 0989"
  },
  items: [
    { id: "1", description: "Web design", qty: 1, price: 5250 },
    { id: "2", description: "Brand book design", qty: 1, price: 2750 },
    { id: "3", description: "UI/UX app design", qty: 1, price: 7520 },
    { id: "4", description: "SEO & SEM optimization", qty: 1, price: 2800 },
    { id: "5", description: "Website speed optimization", qty: 1, price: 1250 }
  ],
  terms: "Fees and payment terms will be established in the contract or agreement prior to the commencement of the project. An initial deposit will be required before any design work begins. We reserve the right to suspend or halt work in the event of non-payment.",
  discount: 0,
  tax: 0,
  project: {
    name: "Corporate Website Redesign",
    code: "PRJ-2024-027",
    startDate: "2024-06-01",
    endDate: "2024-07-26",
    notes: "Revamp marketing site, deliver responsive UI kit, and integrate analytics."
  },
  gradient: defaultGradientId
};
