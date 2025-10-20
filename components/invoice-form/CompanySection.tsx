import React from "react";
import { UseFormReturn } from "react-hook-form";

import type { Invoice } from "@/lib/types";

import { inputClass, labelClass, sectionClass, textareaClass } from "./constants";

type CompanySectionProps = {
  form: Pick<UseFormReturn<Invoice>, "register">;
  className?: string;
};

const CompanySection: React.FC<CompanySectionProps> = ({ form, className }) => {
  const { register } = form;

  return (
    <section className={`${sectionClass} overflow-visible ${className ?? ""}`}>
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
          <textarea
            id="fromAddress"
            rows={3}
            className={`${textareaClass} mt-2 rounded-3xl`}
            {...register("from.address")}
          />
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
  );
};

export default CompanySection;
