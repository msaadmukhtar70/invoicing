import React from "react";
import { X, DollarSign, Euro, PoundSterling, JapaneseYen, SwissFranc, Bitcoin } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Invoice, CurrencyCode } from "@/lib/types";
import PillSelect, { PillOption } from "./PillSelect";
import { total } from "@/lib/currency";

const schema = z.object({
  brandName: z.string().min(1),
  brandLogoDataUrl: z.string().optional(),
  invoiceNumber: z.string().min(1),
  issuedDate: z.string().min(1),
  dueDate: z.string().min(1),
  currency: z.enum(["USD", "EUR", "GBP", "JPY", "CHF", "CNY", "MXN", "BTC"]),
  currencySymbol: z.string().optional(),
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
});

const sectionClass = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";
const sectionTitleClass =
  "mb-5 inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-500";
const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:bg-white focus:ring-2 focus:ring-brix-blue/30";
const textareaClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:bg-white focus:ring-2 focus:ring-brix-blue/30";

const currencyMeta: {
  code: CurrencyCode;
  symbol: string;
  Icon: React.ComponentType<{ className?: string }>;
  colorClass?: string;
}[] = [
  { code: "USD", symbol: "$", Icon: DollarSign, colorClass: "bg-blue-100 text-blue-600" },
  { code: "EUR", symbol: "€", Icon: Euro, colorClass: "bg-indigo-100 text-indigo-600" },
  { code: "GBP", symbol: "£", Icon: PoundSterling, colorClass: "bg-purple-100 text-purple-600" },
  { code: "JPY", symbol: "¥", Icon: JapaneseYen, colorClass: "bg-rose-100 text-rose-500" },
  { code: "CHF", symbol: "CHF", Icon: SwissFranc, colorClass: "bg-red-100 text-red-500" },
  { code: "CNY", symbol: "¥", Icon: JapaneseYen, colorClass: "bg-orange-100 text-orange-500" },
  { code: "MXN", symbol: "$", Icon: DollarSign, colorClass: "bg-emerald-100 text-emerald-600" },
  { code: "BTC", symbol: "₿", Icon: Bitcoin, colorClass: "bg-amber-100 text-amber-600" },
];

export default function InvoiceForm({
  initial,
  onChange,
}: {
  initial: Invoice;
  onChange: (inv: Invoice) => void;
}) {
  const { register, watch, setValue } = useForm<Invoice>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      ...initial,
      project: initial.project ?? { name: "", code: "", startDate: "", endDate: "", notes: "" },
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    const subscription = watch((value) => value && onChange(value as Invoice));
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const brandLogo = watch("brandLogoDataUrl");
  const clientPhoto = watch("to.photoDataUrl");
  const selectedCurrency = watch("currency");
  const itemsList = watch("items");
  const discountRaw = watch("discount");
  const taxRaw = watch("tax");

  const sanitizeNumber = React.useCallback((value: unknown) => {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  }, []);

  const discountValue = sanitizeNumber(discountRaw);
  const taxValue = sanitizeNumber(taxRaw);
  const subtotal = React.useMemo(() => total(itemsList ?? []), [itemsList]);
  const totalDue = React.useMemo(() => subtotal - discountValue + taxValue, [subtotal, discountValue, taxValue]);
  const currencyFormatter = React.useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: selectedCurrency ?? "USD" }),
    [selectedCurrency]
  );
  const formatCurrency = React.useCallback((value: number) => currencyFormatter.format(value), [currencyFormatter]);
  const pricingRows = React.useMemo(
    () => [
      { label: "Subtotal", value: formatCurrency(subtotal), accent: false },
      { label: "Discount", value: discountValue ? formatCurrency(-discountValue) : formatCurrency(0), accent: false },
      { label: "Tax", value: formatCurrency(taxValue), accent: false },
      { label: "Total due", value: formatCurrency(totalDue), accent: true },
    ],
    [discountValue, formatCurrency, subtotal, taxValue, totalDue]
  );

  const brandUploadRef = React.useRef<HTMLInputElement>(null);
  const clientPhotoRef = React.useRef<HTMLInputElement>(null);

  const metaByCode = React.useMemo(() => {
    return currencyMeta.reduce<Record<CurrencyCode, (typeof currencyMeta)[number]>>((acc, item) => {
      acc[item.code] = item;
      return acc;
    }, {} as Record<CurrencyCode, (typeof currencyMeta)[number]>);
  }, []);

  const handleCurrencyPick = React.useCallback(
    (code: CurrencyCode) => {
      const meta = metaByCode[code];
      setValue("currency", code, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setValue("currencySymbol", meta.symbol, { shouldDirty: true, shouldTouch: true });
    },
    [metaByCode, setValue]
  );

  const chooseBrandLogo = () => brandUploadRef.current?.click();
  const onBrandLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setValue("brandLogoDataUrl", reader.result as string, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const clearBrandLogo = () => {
    setValue("brandLogoDataUrl", "", { shouldDirty: true });
    if (brandUploadRef.current) {
      brandUploadRef.current.value = "";
    }
  };

  const chooseClientPhoto = () => clientPhotoRef.current?.click();
  const onClientPhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setValue("to.photoDataUrl", reader.result as string, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const clearClientPhoto = () => {
    setValue("to.photoDataUrl", "", { shouldDirty: true });
    if (clientPhotoRef.current) {
      clientPhotoRef.current.value = "";
    }
  };

  const months = React.useMemo<PillOption[]>(
    () => [
      { label: "Jan", detail: "January" },
      { label: "Feb", detail: "February" },
      { label: "Mar", detail: "March" },
      { label: "Apr", detail: "April" },
      { label: "May", detail: "May" },
      { label: "Jun", detail: "June" },
      { label: "Jul", detail: "July" },
      { label: "Aug", detail: "August" },
      { label: "Sep", detail: "September" },
      { label: "Oct", detail: "October" },
      { label: "Nov", detail: "November" },
      { label: "Dec", detail: "December" },
    ],
    []
  );

  const parseDateParts = React.useCallback(
    (value: string): { month: number; day: number; year: number } => {
      if (!value) {
        const today = new Date();
        return { month: today.getMonth(), day: today.getDate(), year: today.getFullYear() };
      }
      const [y, m, d] = value.split("-").map((part) => parseInt(part, 10));
      if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) {
        const today = new Date();
        return { month: today.getMonth(), day: today.getDate(), year: today.getFullYear() };
      }
      return { month: m - 1, day: d, year: y };
    },
    []
  );

  const toIsoDate = React.useCallback((year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const issuedDateValue = watch("issuedDate");
  const dueDateValue = watch("dueDate");
  const issuedParts = React.useMemo(() => parseDateParts(issuedDateValue), [issuedDateValue, parseDateParts]);
  const dueParts = React.useMemo(() => parseDateParts(dueDateValue), [dueDateValue, parseDateParts]);

  const updateDateField = React.useCallback(
    (field: "issuedDate" | "dueDate", part: "month" | "day" | "year", value: number) => {
      const current = field === "issuedDate" ? issuedParts : dueParts;
      const next = { ...current, [part]: value };
      const iso = toIsoDate(next.year, next.month, next.day);
      setValue(field, iso, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    },
    [issuedParts, dueParts, toIsoDate, setValue]
  );

  const renderDateEditor = (field: "issuedDate" | "dueDate", parts: { month: number; day: number; year: number }) => (
    <div className="mt-2 flex flex-nowrap items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3">
      <PillSelect
        options={months}
        value={parts.month}
        onChange={(index) => updateDateField(field, "month", index)}
        ariaLabel="Select month"
        className="w-24 shrink-0"
      />
      <input
        type="number"
        min={1}
        max={31}
        value={parts.day}
        onChange={(event) => updateDateField(field, "day", Math.min(31, Math.max(1, Number(event.target.value))))}
        className="w-14 shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
      />
      <input
        type="number"
        min={1900}
        max={3000}
        value={parts.year}
        onChange={(event) => updateDateField(field, "year", Number(event.target.value))}
        className="w-20 shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-5 xl:flex-nowrap">
        <div className="flex w-full flex-col gap-6 xl:w-[280px]">
          <section className={`${sectionClass} overflow-hidden`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Brand</div>
          <div className="space-y-5 pt-5">
            <div>
              <div className={labelClass}>Isotype</div>
              <div className="relative mt-2">
                <button
                  type="button"
                  onClick={chooseBrandLogo}
                  className="flex h-24 w-full items-center justify-center rounded-[28px] border border-slate-200 bg-white text-slate-400 shadow-inner transition hover:border-brix-blue/40"
                >
                  {brandLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brandLogo} alt="Brand isotype" className="h-full w-full object-contain px-5 py-3" />
                  ) : (
                    <span className="text-sm font-semibold">Upload image</span>
                  )}
                </button>
                {brandLogo && brandLogo !== "" && (
                  <button
                    type="button"
                    onClick={clearBrandLogo}
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-brix-blue hover:text-brix-blue"
                    aria-label="Remove brand isotype"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <input
                ref={brandUploadRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onBrandLogoSelect}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="brandName">
                Logotype
              </label>
              <input
                id="brandName"
                className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-center text-xl font-black tracking-tight text-slate-800 outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
                {...register("brandName")}
              />
            </div>
          </div>
        </section>

        <section className={`${sectionClass} overflow-hidden`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Bill to:</div>
          <div className="space-y-4 pt-5">
            <div>
              <label className={labelClass} htmlFor="toName">
                Customer
              </label>
              <input id="toName" className={`${inputClass} mt-2 rounded-full`} {...register("to.name")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="toAddress">
                Address
              </label>
              <textarea
                id="toAddress"
                rows={3}
                className={`${textareaClass} mt-2 rounded-3xl`}
                {...register("to.address")}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="toEmail">
                Email
              </label>
              <input id="toEmail" className={`${inputClass} mt-2 rounded-full`} {...register("to.email")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="toPhone">
                Phone number
              </label>
              <input id="toPhone" className={`${inputClass} mt-2 rounded-full`} {...register("to.phone")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="toTax">
                Tax number
              </label>
              <input id="toTax" className={`${inputClass} mt-2 rounded-full`} {...register("to.taxNumber")} />
            </div>
            <div>
              <div className={labelClass}>Photo</div>
              <div className="relative mt-2">
                <button
                  type="button"
                  onClick={chooseClientPhoto}
                  className="flex h-32 w-full items-center justify-center rounded-[28px] border border-slate-200 bg-white text-slate-400 shadow-inner transition hover:border-brix-blue/40"
                >
                  {clientPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={clientPhoto} alt="Client photo" className="h-full w-full rounded-[24px] object-contain px-5 py-3" />
                  ) : (
                    <span className="text-sm font-semibold">Upload photo</span>
                  )}
                </button>
                <input
                  ref={clientPhotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onClientPhotoSelect}
                />
                {clientPhoto && (
                  <button
                    type="button"
                    onClick={clearClientPhoto}
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-brix-blue hover:text-brix-blue"
                    aria-label="Remove client photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={`${sectionClass} overflow-hidden`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Project details</div>
          <div className="space-y-4 pt-5">
            <div>
              <label className={labelClass} htmlFor="projectName">
                Project name
              </label>
              <input id="projectName" className={`${inputClass} mt-2 rounded-full`} {...register("project.name")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="projectCode">
                Project code
              </label>
              <input id="projectCode" className={`${inputClass} mt-2 rounded-full`} {...register("project.code")} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="projectStart">
                  Start date
                </label>
                <input
                  id="projectStart"
                  type="date"
                  className={`${inputClass} mt-2 rounded-full`}
                  {...register("project.startDate")}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="projectEnd">
                  End date
                </label>
                <input
                  id="projectEnd"
                  type="date"
                  className={`${inputClass} mt-2 rounded-full`}
                  {...register("project.endDate")}
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="projectNotes">
                Scope / Notes
              </label>
              <textarea
                id="projectNotes"
                rows={3}
                className={`${textareaClass} mt-2 rounded-3xl`}
                {...register("project.notes")}
              />
            </div>
          </div>
        </section>

        <section className={`${sectionClass} overflow-hidden`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Pricing summary</div>
          <div className="space-y-3 pt-5">
            {pricingRows.map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ${
                  row.accent ? "border-brix-blue/40" : ""
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.label}</span>
                <span className={`text-sm font-semibold ${row.accent ? "text-brix-blue" : "text-slate-800"}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex w-full flex-col gap-6 xl:w-[340px]">
        <section className={`${sectionClass} overflow-hidden`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Invoice information</div>
          <div className="space-y-4 pt-5">
            <div>
              <label className={labelClass} htmlFor="invoiceNumber">
                Invoice number
              </label>
              <input id="invoiceNumber" className={`${inputClass} mt-2 rounded-full`} {...register("invoiceNumber")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="issuedDate">
                Invoice date
              </label>
              {renderDateEditor("issuedDate", issuedParts)}
            </div>
            <div>
              <label className={labelClass} htmlFor="dueDate">
                Payment due
              </label>
              {renderDateEditor("dueDate", dueParts)}
            </div>
            <div>
              <label className={labelClass} htmlFor="fromName">
                Name / Company
              </label>
              <input id="fromName" className={`${inputClass} mt-2 rounded-full`} {...register("from.name")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="fromAddress">
                Address
              </label>
              <textarea id="fromAddress" rows={3} className={`${textareaClass} mt-2 rounded-3xl`} {...register("from.address")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="fromTax">
                Tax number
              </label>
              <input id="fromTax" className={`${inputClass} mt-2 rounded-full`} {...register("from.taxNumber")} />
            </div>
          </div>
        </section>
      </div>

      <div className="flex w-full flex-col gap-6 xl:w-[340px]">
        <section className={`${sectionClass} overflow-hidden`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Company information</div>
          <div className="space-y-4 pt-5">
            <div>
              <label className={labelClass} htmlFor="fromWebsite">
                Web
              </label>
              <input id="fromWebsite" className={`${inputClass} mt-2 rounded-full`} {...register("from.website")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="fromEmail">
                Email
              </label>
              <input id="fromEmail" className={`${inputClass} mt-2 rounded-full`} {...register("from.email")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="fromPhone">
                Number Phone
              </label>
              <input id="fromPhone" className={`${inputClass} mt-2 rounded-full`} {...register("from.phone")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="terms">
                Terms &amp; Conditions
              </label>
              <textarea
                id="terms"
                rows={6}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-inner outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
                {...register("terms")}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex w-full flex-col gap-6 xl:w-[340px]">
        <section className={`${sectionClass} overflow-hidden`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Other information</div>
          <div className="space-y-4 pt-5">
            <div>
              <label className={labelClass} htmlFor="currencySymbol">
                Currency Symbol
              </label>
              <div className="mt-2 flex items-center rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-inner">
                <input
                  id="currencySymbol"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-center text-sm font-semibold text-slate-700 outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
                  {...register("currencySymbol")}
                  maxLength={4}
                  placeholder={currencyMeta.find((c) => c.code === selectedCurrency)?.symbol ?? "$"}
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="currencyCode">
                Currency Code
              </label>
              <div className="mt-2 flex items-center rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-inner">
                <span className="flex h-10 min-w-[3.5rem] items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                  {selectedCurrency}
                </span>
              </div>
            </div>
            <div>
              <div className={labelClass}>Currencies</div>
              <div className="mt-3 rounded-[32px] border border-slate-200 bg-white p-4 shadow-inner">
                <div className="flex flex-wrap gap-2 text-[10px] sm:text-[11px]">
                  {currencyMeta.map((currency) => (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => handleCurrencyPick(currency.code)}
                      className={`flex min-w-max items-center gap-1 rounded-full border px-3 py-1.5 font-semibold transition ${
                        selectedCurrency === currency.code
                          ? "border-brix-blue bg-brix-blue/10 text-brix-blue shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-brix-blue/40"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 ${currency.colorClass ?? "text-slate-600"}`}
                        aria-hidden
                      >
                        <currency.Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-none">
                        ({currency.code}) {currency.symbol}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className={labelClass}>Gradient</div>
              <div className="mt-2 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-inner">
                <div className="relative mx-auto h-28 w-full max-w-[200px]">
                  <span className="absolute -top-6 left-0 h-20 w-20 rounded-full bg-brix-blue/40 blur-[30px]" />
                  <span className="absolute -bottom-4 right-0 h-20 w-24 rounded-full bg-sky-200/70 blur-[35px]" />
                  <span className="absolute inset-6 rounded-full border border-white/60" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className={`${sectionClass} overflow-hidden`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Project details</div>
          <div className="space-y-4 pt-5">
            <div>
              <label className={labelClass} htmlFor="projectName">
                Project name
              </label>
              <input id="projectName" className={`${inputClass} mt-2 rounded-full`} {...register("project.name")} />
            </div>
            <div>
              <label className={labelClass} htmlFor="projectCode">
                Project code
              </label>
              <input id="projectCode" className={`${inputClass} mt-2 rounded-full`} {...register("project.code")} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="projectStart">
                  Start date
                </label>
                <input
                  id="projectStart"
                  type="date"
                  className={`${inputClass} mt-2 rounded-full`}
                  {...register("project.startDate")}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="projectEnd">
                  End date
                </label>
                <input
                  id="projectEnd"
                  type="date"
                  className={`${inputClass} mt-2 rounded-full`}
                  {...register("project.endDate")}
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="projectNotes">
                Scope / Notes
              </label>
              <textarea
                id="projectNotes"
                rows={4}
                className={`${textareaClass} mt-2 rounded-3xl`}
                {...register("project.notes")}
              />
            </div>
          </div>
        </section>

        <section className={`${sectionClass} overflow-hidden`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Pricing summary</div>
          <div className="space-y-3 pt-5">
            {pricingRows.map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ${
                  row.accent ? "border-brix-blue/40" : ""
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.label}</span>
                <span className={`text-sm font-semibold ${row.accent ? "text-brix-blue" : "text-slate-800"}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
</div>
  );
}