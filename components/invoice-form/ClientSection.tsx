import React from "react";
import { X } from "lucide-react";
import { useWatch } from "react-hook-form";

import { inputClass, labelClass, sectionClass, textareaClass } from "./constants";
import type { InvoiceFormContext } from "./formTypes";

type ClientSectionProps = {
  form: Pick<InvoiceFormContext, "register" | "control" | "setValue">;
  className?: string;
};

const ClientSection: React.FC<ClientSectionProps> = ({ form, className }) => {
  const { register, control, setValue } = form;

  const clientPhoto = useWatch({ control, name: "to.photoDataUrl" }) as string | undefined;
  const clientPhotoRef = React.useRef<HTMLInputElement>(null);

  const handleChooseClientPhoto = React.useCallback(() => {
    clientPhotoRef.current?.click();
  }, []);

  const handleClientPhotoSelect = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setValue("to.photoDataUrl", reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    },
    [setValue]
  );

  const handleClearClientPhoto = React.useCallback(() => {
    setValue("to.photoDataUrl", "", { shouldDirty: true });
    if (clientPhotoRef.current) {
      clientPhotoRef.current.value = "";
    }
  }, [setValue]);

  return (
    <section className={`${sectionClass} overflow-hidden ${className ?? ""}`}>
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
          <textarea id="toAddress" rows={3} className={`${textareaClass} mt-2 rounded-3xl`} {...register("to.address")} />
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
              onClick={handleChooseClientPhoto}
              className="flex h-32 w-full items-center justify-center rounded-[28px] border border-slate-200 bg-white text-slate-400 shadow-inner transition hover:border-brix-blue/40"
            >
              {clientPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={clientPhoto} alt="Client photo" className="h-full w-full rounded-[24px] object-contain px-5 py-3" />
              ) : (
                <span className="text-sm font-semibold">Upload photo</span>
              )}
            </button>
            <input ref={clientPhotoRef} type="file" accept="image/*" className="hidden" onChange={handleClientPhotoSelect} />
            {clientPhoto && (
              <button
                type="button"
                onClick={handleClearClientPhoto}
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
  );
};

export default ClientSection;
