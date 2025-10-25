import React from "react";
import type { InvoiceFormContext } from "./formTypes";

import {
  inputClass,
  inputErrorClass,
  labelClass,
  sectionClass,
  textareaClass,
  errorTextClass,
  requiredMarkClass,
  requiredSrOnlyClass,
} from "./constants";

type CompanySectionProps = {
  form: Pick<InvoiceFormContext, "register" | "formState">;
  className?: string;
};

const CompanySection: React.FC<CompanySectionProps> = ({ form, className }) => {
  const {
    register,
    formState: { errors },
  } = form;

  const senderNameError = errors.from?.name?.message as string | undefined;

  return (
    <section className={`${sectionClass} overflow-visible ${className ?? ""}`}>
      <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Company information</div>
      <div className="space-y-4 pt-5">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="fromName">
            Name / Company
            <span className={requiredMarkClass} aria-hidden="true">
              *
            </span>
            <span className={requiredSrOnlyClass}>Required</span>
          </label>
          <input
            id="fromName"
            className={`${inputClass} mt-2 rounded-full ${senderNameError ? inputErrorClass : ""}`}
            placeholder="Enter your company or legal name"
            aria-invalid={senderNameError ? "true" : "false"}
            aria-describedby={senderNameError ? "fromName-error" : undefined}
            {...register("from.name")}
          />
          {senderNameError ? (
            <p id="fromName-error" className={errorTextClass}>
              {senderNameError}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="fromAddress">
            Address
          </label>
          <textarea
            id="fromAddress"
            rows={3}
            className={`${textareaClass} mt-2 rounded-3xl`}
            placeholder="Street, city, state, postal code"
            {...register("from.address")}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="fromTax">
            Tax number
          </label>
          <input
            id="fromTax"
            className={`${inputClass} mt-2 rounded-full`}
            placeholder="Company tax ID"
            {...register("from.taxNumber")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="fromWebsite">
            Web
          </label>
          <input
            id="fromWebsite"
            className={`${inputClass} mt-2 rounded-full`}
            placeholder="https://yourcompany.com"
            {...register("from.website")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="fromEmail">
            Email
          </label>
          <input
            id="fromEmail"
            className={`${inputClass} mt-2 rounded-full`}
            placeholder="you@company.com"
            {...register("from.email")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="fromPhone">
            Phone Number
          </label>
          <input
            id="fromPhone"
            className={`${inputClass} mt-2 rounded-full`}
            placeholder="+1 555 123 4567"
            {...register("from.phone")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="terms">
            Terms &amp; Conditions
          </label>
          <textarea
            id="terms"
            rows={6}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-inner outline-none transition focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
            placeholder="Example: Payment due within 30 days of invoice date"
            {...register("terms")}
          />
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
