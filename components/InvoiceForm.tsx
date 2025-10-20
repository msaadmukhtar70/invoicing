import React from "react";
import { X, DollarSign, Euro, PoundSterling, JapaneseYen, SwissFranc, Bitcoin, Plus, Trash2, Check } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Invoice, CurrencyCode } from "@/lib/types";
import { gradientOptions, defaultGradientId } from "@/lib/gradients";
import type { GradientId } from "@/lib/gradients";
import { popularBrandColors, defaultBrandColor, mixHexColors, NO_BRAND_COLOR } from "@/lib/colors";
import PillSelect, { PillOption } from "./PillSelect";
import { total } from "@/lib/currency";

const gradientIdSet = new Set(gradientOptions.map((option) => option.id));
const hexColorRegExp = /^#([0-9A-Fa-f]{6})$/;
const dashboardAccentColor = "#FF5722"; // Matches dashboard accent (red-orange)

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

const sectionClass = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";
const sectionTitleClass =
  "mb-5 inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-500";
const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:bg-white focus:ring-2 focus:ring-brix-blue/30";
const textareaClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:bg-white focus:ring-2 focus:ring-brix-blue/30";

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
  const { register, watch, setValue, control } = useForm<Invoice>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      ...initial,
      brandColor: initial.brandColor ?? defaultBrandColor,
      gradient: initial.gradient ?? defaultGradientId,
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
  const currencySymbolValue = watch("currencySymbol");
  const itemsList = watch("items");
  const brandColorRaw = watch("brandColor");
  const gradientValue = watch("gradient") ?? defaultGradientId;
  const discountRaw = watch("discount");
  const taxRaw = watch("tax");

  const isNeutralBrandColor = brandColorRaw === NO_BRAND_COLOR;
  const brandColorValue = React.useMemo(() => {
    if (
      typeof brandColorRaw === "string" &&
      brandColorRaw !== NO_BRAND_COLOR &&
      hexColorRegExp.test(brandColorRaw)
    ) {
      return brandColorRaw.toUpperCase();
    }
    return null;
  }, [brandColorRaw]);
  const brandColorDisplay = brandColorValue ?? defaultBrandColor;
  const isCustomBrandColor =
    !!brandColorValue && !popularBrandColors.some((color) => color.toUpperCase() === brandColorValue);
  const colorInputValue = brandColorValue ?? defaultBrandColor;
  const [customHexDraft, setCustomHexDraft] = React.useState("");

  React.useEffect(() => {
    setCustomHexDraft(brandColorValue ?? "");
  }, [brandColorValue]);

  const selectedGradient = React.useMemo(
    () =>
      gradientOptions.find((option) => option.id === gradientValue) ??
      gradientOptions.find((option) => option.id === defaultGradientId) ??
      gradientOptions[0],
    [gradientValue]
  );
  const selectedGradientId = selectedGradient.id;

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

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: "items",
  });

  const brandColorField = register("brandColor");
  const gradientField = register("gradient");

  const createItemId = React.useCallback(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }, []);

  const handleAddItem = React.useCallback(() => {
    appendItem({ id: createItemId(), description: "", qty: 1, price: 0 });
  }, [appendItem, createItemId]);

  const metaByCode = React.useMemo(() => {
    return currencyMeta.reduce<Record<CurrencyCode, (typeof currencyMeta)[number]>>((acc, item) => {
      acc[item.code] = item;
      return acc;
    }, {} as Record<CurrencyCode, (typeof currencyMeta)[number]>);
  }, []);

  const handleBrandColorPick = React.useCallback(
    (color: string) => {
      if (color === NO_BRAND_COLOR) {
        setValue("brandColor", NO_BRAND_COLOR, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
        return;
      }
      const normalized = color.toUpperCase();
      if (hexColorRegExp.test(normalized)) {
        setValue("brandColor", normalized, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleCustomHexInputChange = React.useCallback(
    (value: string) => {
      const upper = value.toUpperCase();
      const cleaned = upper.replace(/[^0-9A-F#]/g, "");
      const stripped = cleaned.replace(/#/g, "");
      const truncated = stripped.slice(0, 6);
      const formatted = truncated ? `#${truncated}` : "";
      setCustomHexDraft(formatted);
      if (hexColorRegExp.test(formatted)) {
        handleBrandColorPick(formatted);
      }
    },
    [handleBrandColorPick]
  );

  const handleCustomHexInputBlur = React.useCallback(() => {
    setCustomHexDraft(brandColorValue ?? "");
  }, [brandColorValue]);

  const handleCurrencyPick = React.useCallback(
    (code: CurrencyCode) => {
      const meta = metaByCode[code];
      setValue("currency", code, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setValue("currencySymbol", meta.symbol, { shouldDirty: true, shouldTouch: true });
    },
    [metaByCode, setValue]
  );

  const handleGradientPick = React.useCallback(
    (id: GradientId) => {
      setValue("gradient", id, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    },
    [setValue]
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
    <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-3xl border border-slate-200 bg-white px-3 py-2">
      <PillSelect
        options={months}
        value={parts.month}
        onChange={(index) => updateDateField(field, "month", index)}
        ariaLabel="Select month"
        className="w-20 shrink-0"
      />
      <input
        type="number"
        min={1}
        max={31}
        value={parts.day}
        onChange={(event) => updateDateField(field, "day", Math.min(31, Math.max(1, Number(event.target.value))))}
        className="w-12 shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
      />
      <input
        type="number"
        min={1900}
        max={3000}
        value={parts.year}
        onChange={(event) => updateDateField(field, "year", Number(event.target.value))}
        className="w-[4.5rem] shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-4 xl:grid-rows-[repeat(6,minmax(0,auto))]">
        <section className={`${sectionClass} overflow-hidden xl:col-start-1 xl:row-start-1 xl:row-span-1`}>
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
            <div>
              <div className={labelClass}>Brand color</div>
              <input type="hidden" {...brandColorField} value={typeof brandColorRaw === "string" ? brandColorRaw : ""} />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleBrandColorPick(NO_BRAND_COLOR)}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brix-blue/40 ${
                    isNeutralBrandColor
                      ? "border-slate-500 bg-white text-slate-600 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                  aria-pressed={isNeutralBrandColor}
                  aria-label="Use no brand color"
                >
                  <span className="pointer-events-none absolute inset-[5px] rounded-full border border-dashed border-slate-300" />
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none flex h-full w-full items-center justify-center text-[9px] font-semibold uppercase tracking-wide transition-opacity ${
                      isNeutralBrandColor ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    None
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  >
                    <Check
                      className={`h-4 w-4 transition-transform transition-opacity ${
                        isNeutralBrandColor ? "opacity-100 text-slate-600" : "opacity-0 translate-y-1 text-slate-500"
                      }`}
                    />
                  </span>
                </button>
                {popularBrandColors.map((color) => {
                  const normalized = color.toUpperCase();
                  const isActive = normalized === brandColorValue;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleBrandColorPick(color)}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brix-blue/40 hover:-translate-y-0.5"
                      style={{ background: color }}
                      aria-pressed={isActive}
                      aria-label={`Select brand color ${color}`}
                    >
                      <span
                        className={`pointer-events-none absolute inset-0 rounded-full border-2 transition ${
                          isActive ? "border-white/80 shadow-[0_4px_14px_rgba(15,23,42,0.25)]" : "border-transparent shadow-none"
                        }`}
                      />
                      <Check
                        aria-hidden="true"
                        className={`pointer-events-none h-4 w-4 text-white drop-shadow transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
                      />
                    </button>
                  );
                })}
              </div>
              <div
                className={`mt-3 flex flex-nowrap items-center gap-2.5 rounded-2xl border bg-white px-3 py-3 shadow-inner transition ${
                  isCustomBrandColor ? "border-brix-blue/70" : "border-slate-200"
                }`}
                style={{ borderColor: isCustomBrandColor ? brandColorDisplay : undefined }}
              >
                <div className="flex shrink-0 items-center gap-2">
                  <label className="relative flex h-10 w-16 items-center justify-center rounded-xl bg-white">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none block h-8 w-12 rounded-lg border border-white/60 shadow-sm transition duration-150"
                      style={{ background: colorInputValue }}
                    />
                    <input
                      type="color"
                      value={colorInputValue}
                      onChange={(event) => handleBrandColorPick(event.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label="Pick custom brand color"
                    />
                  </label>
                  <span className="text-sm font-semibold text-slate-600">Custom</span>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-1.5">
                  <input
                    type="text"
                    inputMode="text"
                    value={customHexDraft}
                    onChange={(event) => handleCustomHexInputChange(event.target.value)}
                    onBlur={handleCustomHexInputBlur}
                    placeholder="#000000"
                    className="w-[3.5rem] min-w-0 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold uppercase text-slate-600 outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30 sm:w-[4.5rem] sm:px-3"
                  />
                  <Check
                    aria-hidden="true"
                    className={`h-4 w-4 text-slate-500 transition-opacity ${
                      isCustomBrandColor && brandColorValue ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${sectionClass} overflow-hidden xl:col-start-1 xl:row-start-2 xl:row-span-1`}>

          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Invoice information</div>
          <div className="grid gap-3 pt-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="invoiceNumber">
                Invoice number
              </label>
              <input id="invoiceNumber" className={`${inputClass} mt-2 rounded-full`} {...register("invoiceNumber")} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="issuedDate">
                Invoice date
              </label>
              {renderDateEditor("issuedDate", issuedParts)}
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="dueDate">
                Payment due
              </label>
              {renderDateEditor("dueDate", dueParts)}
            </div>

          </div>
        </section>

        <section className={`${sectionClass} overflow-visible xl:overflow-visible xl:col-start-2 xl:row-start-1 xl:row-span-2`}>

          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Company information</div>
          <div className="space-y-4 pt-5">
                        <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="fromName">
                Name / Company
              </label>
              <input id="fromName" className={`${inputClass} mt-2 rounded-full`} {...register("from.name")} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="fromAddress">
                Address
              </label>
              <textarea id="fromAddress" rows={3} className={`${textareaClass} mt-2 rounded-3xl`} {...register("from.address")} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="fromTax">
                Tax number
              </label>
              <input id="fromTax" className={`${inputClass} mt-2 rounded-full`} {...register("from.taxNumber")} />
            </div>
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

        <section className={`${sectionClass} overflow-hidden xl:col-start-3 xl:row-start-1 xl:row-span-2`}>
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

        <section className={`${sectionClass} overflow-hidden xl:col-start-4 xl:row-start-1 xl:row-span-2`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Other information</div>
          <div className="space-y-4 pt-5">
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
              <input type="hidden" {...gradientField} value={gradientValue} />
              <div className="mt-3 grid grid-cols-1 gap-3">
                {gradientOptions.map((option) => {
                  const isActive = option.id === selectedGradientId;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleGradientPick(option.id)}
                      className={`flex items-center gap-4 rounded-2xl border p-3 transition ${
                        isActive ? "shadow-sm" : "hover:border-slate-300"
                      }`}
                      style={{
                        borderColor: isActive ? dashboardAccentColor : "#E2E8F0",
                        background: isActive ? mixHexColors(dashboardAccentColor, "#FFFFFF", 0.75) : "#FFFFFF",
                      }}
                    >
                      <span
                        className={`h-10 w-10 shrink-0 rounded-lg ${option.swatchClass}`}
                        aria-hidden
                      />
                      <span className="flex min-w-0 flex-col text-left">
                        <span className="truncate text-sm font-semibold leading-tight text-slate-700">
                          {option.name}
                        </span>
                        <span
                          className="text-[11px] font-semibold uppercase tracking-wide"
                          style={isActive ? { color: dashboardAccentColor } : undefined}
                        >
                          {isActive ? "Active" : "Select"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-inner">
                <div
                  className={`relative mx-auto h-28 w-full max-w-[220px] overflow-hidden rounded-[32px] ${selectedGradient.backgroundClass}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${selectedGradient.highlightClass} opacity-70`}
                  />
                  <div className="absolute inset-6 rounded-[28px] border border-white/60 bg-white/20 backdrop-blur-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={`${sectionClass} overflow-hidden xl:col-start-2 xl:col-span-2 xl:row-start-3 xl:row-span-2`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">
            Project
          </div>
          <div className="space-y-4 pt-5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className={labelClass}>Project items</div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-2 rounded-full border border-brix-blue px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brix-blue transition hover:bg-brix-blue/10"
                >
                  <Plus className="h-4 w-4" />
                  Add item
                </button>
              </div>
              <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-inner">
                <div className="grid grid-cols-[minmax(0,3fr)_80px_120px_110px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>Description</span>
                  <span className="text-center">Qty</span>
                  <span className="text-center">Price</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {itemFields.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">No items yet. Add your first item.</div>
                  ) : (
                    itemFields.map((field, index) => {
                      const currentItem = itemsList?.[index];
                      const lineTotal =
                        sanitizeNumber(currentItem?.qty) * sanitizeNumber(currentItem?.price);
                      return (
                        <div
                          key={field.id}
                          className="grid grid-cols-[minmax(0,3fr)_80px_120px_110px] grid-rows-[auto_auto] items-center gap-x-2.5 gap-y-2 px-4 py-3"
                        >
                          <input
                            className={`${inputClass} rounded-full row-start-1`}
                            placeholder="Description"
                            {...register(`items.${index}.description` as const)}
                          />
                          <input
                            type="number"
                            min={0}
                            step={1}
                            className={`${inputClass} rounded-full text-center row-start-1`}
                            {...register(`items.${index}.qty` as const, { valueAsNumber: true })}
                          />
                          <div className="row-start-1 flex items-center justify-center gap-2">
                            <span className="text-xs font-semibold text-slate-400">
                              {currencySymbolValue ?? currencyMeta.find((c) => c.code === selectedCurrency)?.symbol ?? "$"}
                            </span>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              className={`${inputClass} rounded-full`}
                              {...register(`items.${index}.price` as const, { valueAsNumber: true })}
                            />
                          </div>
                          <span className="row-start-1 text-right text-sm font-semibold text-slate-800">
                            {formatCurrency(lineTotal || 0)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="col-start-1 col-end-2 row-start-2 inline-flex w-max items-center gap-1 rounded-full border border-transparent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 transition hover:border-rose-200 hover:text-rose-500 whitespace-nowrap"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${sectionClass} overflow-hidden xl:col-start-4 xl:row-start-3 xl:row-span-2`}>
          <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Price</div>
          <div className="space-y-4 pt-5">
            <div>
              <label className={labelClass} htmlFor="discount">
                Discount
              </label>
              <input
                id="discount"
                type="number"
                step="0.01"
                min={0}
                className={`${inputClass} mt-2 rounded-full`}
                {...register("discount", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="tax">
                Tax
              </label>
              <input
                id="tax"
                type="number"
                step="0.01"
                min={0}
                className={`${inputClass} mt-2 rounded-full`}
                {...register("tax", { valueAsNumber: true })}
              />
            </div>
            <div>
              <div className={labelClass}>Summary</div>
              <div className="mt-3 space-y-3">
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
