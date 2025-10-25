import React from "react";
import { useWatch } from "react-hook-form";

import PillSelect, { PillOption } from "../PillSelect";
import {
  inputClass,
  inputErrorClass,
  labelClass,
  sectionClass,
  errorTextClass,
  requiredMarkClass,
  requiredSrOnlyClass,
} from "./constants";
import type { InvoiceFormContext } from "./formTypes";

type InvoiceDetailsSectionProps = {
  form: Pick<InvoiceFormContext, "register" | "control" | "setValue" | "formState">;
  className?: string;
};

type DateParts = { month: number; day: number; year: number };

const monthOptions: PillOption[] = [
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
];

// Treat invoice dates as local calendar days and fall back to "today" when parsing fails.
const parseDateParts = (value: string | undefined): DateParts => {
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
};

const toIsoDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const DateEditor: React.FC<{
  field: "issuedDate" | "dueDate";
  value: DateParts;
  onChange: (field: "issuedDate" | "dueDate", part: "month" | "day" | "year", value: number) => void;
  error?: string;
  errorId?: string;
}> = ({ field, value, onChange, error, errorId }) => {
  return (
    <div
      className={`mt-2 flex flex-wrap items-center gap-1.5 rounded-3xl border bg-white px-3 py-2 transition ${
        error ? "border-rose-400 ring-1 ring-rose-200" : "border-slate-200"
      }`}
      role="group"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? errorId : undefined}
    >
      <PillSelect
        options={monthOptions}
        value={value.month}
        onChange={(index) => onChange(field, "month", index)}
        ariaLabel="Select month"
        className="w-20 shrink-0"
      />
      <input
        id={`${field}-day`}
        type="number"
        min={1}
        max={31}
        value={value.day}
        onChange={(event) => {
          const nextValue = Math.min(31, Math.max(1, Number(event.target.value)));
          onChange(field, "day", nextValue);
        }}
        placeholder="DD"
        className="w-12 shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
      />
      <input
        type="number"
        min={1900}
        max={3000}
        value={value.year}
        onChange={(event) => onChange(field, "year", Number(event.target.value))}
        placeholder="YYYY"
        className="w-[4.5rem] shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
      />
    </div>
  );
};

const InvoiceDetailsSection: React.FC<InvoiceDetailsSectionProps> = ({ form, className }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  const issuedDateValue = useWatch({ control, name: "issuedDate" }) as string | undefined;
  const dueDateValue = useWatch({ control, name: "dueDate" }) as string | undefined;

  const issuedParts = React.useMemo(() => parseDateParts(issuedDateValue), [issuedDateValue]);
  const dueParts = React.useMemo(() => parseDateParts(dueDateValue), [dueDateValue]);

  const invoiceNumberError = errors.invoiceNumber?.message as string | undefined;
  const issuedDateError = errors.issuedDate?.message as string | undefined;
  const dueDateError = errors.dueDate?.message as string | undefined;

  const updateDateField = React.useCallback(
    (field: "issuedDate" | "dueDate", part: "month" | "day" | "year", value: number) => {
      const current = field === "issuedDate" ? issuedParts : dueParts;
      const next = { ...current, [part]: value };
      const iso = toIsoDate(next.year, next.month, next.day);
      setValue(field, iso, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    },
    [dueParts, issuedParts, setValue]
  );

  return (
    <section className={`${sectionClass} overflow-hidden ${className ?? ""}`}>
      <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Invoice information</div>
      <div className="grid gap-3 pt-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="invoiceNumber">
            Invoice number
            <span className={requiredMarkClass} aria-hidden="true">
              *
            </span>
            <span className={requiredSrOnlyClass}>Required</span>
          </label>
          <input
            id="invoiceNumber"
            className={`${inputClass} mt-2 rounded-full ${invoiceNumberError ? inputErrorClass : ""}`}
            placeholder="e.g. INV-0001"
            aria-invalid={invoiceNumberError ? "true" : "false"}
            aria-describedby={invoiceNumberError ? "invoiceNumber-error" : undefined}
            {...register("invoiceNumber")}
          />
          {invoiceNumberError ? (
            <p id="invoiceNumber-error" className={errorTextClass}>
              {invoiceNumberError}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="issuedDate-day">
            Invoice date
            <span className={requiredMarkClass} aria-hidden="true">
              *
            </span>
            <span className={requiredSrOnlyClass}>Required</span>
          </label>
          <DateEditor field="issuedDate" value={issuedParts} onChange={updateDateField} error={issuedDateError} errorId="issuedDate-error" />
          {issuedDateError ? (
            <p id="issuedDate-error" className={errorTextClass}>
              {issuedDateError}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="dueDate-day">
            Payment due
            <span className={requiredMarkClass} aria-hidden="true">
              *
            </span>
            <span className={requiredSrOnlyClass}>Required</span>
          </label>
          <DateEditor field="dueDate" value={dueParts} onChange={updateDateField} error={dueDateError} errorId="dueDate-error" />
          {dueDateError ? (
            <p id="dueDate-error" className={errorTextClass}>
              {dueDateError}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default InvoiceDetailsSection;
