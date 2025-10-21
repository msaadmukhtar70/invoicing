import React from "react";
import { Check, X } from "lucide-react";
import { useWatch } from "react-hook-form";

import { popularBrandColors, defaultBrandColor, NO_BRAND_COLOR } from "@/lib/colors";

import { hexColorRegExp, labelClass, sectionClass } from "./constants";
import type { InvoiceFormContext } from "./formTypes";

type BrandSectionProps = {
  form: Pick<InvoiceFormContext, "register" | "control" | "setValue">;
  className?: string;
};

const BrandSection: React.FC<BrandSectionProps> = ({ form, className }) => {
  const { register, control, setValue } = form;

  const brandLogo = useWatch({ control, name: "brandLogoDataUrl" }) as string | undefined;
  const brandColorRaw = useWatch({ control, name: "brandColor" }) as string | undefined;

  const brandUploadRef = React.useRef<HTMLInputElement>(null);

  const brandColorValue = React.useMemo(() => {
    if (brandColorRaw && brandColorRaw !== NO_BRAND_COLOR && hexColorRegExp.test(brandColorRaw)) {
      return brandColorRaw.toUpperCase();
    }
    return null;
  }, [brandColorRaw]);

  const [customHexDraft, setCustomHexDraft] = React.useState("");

  const isNeutralBrandColor = brandColorRaw === NO_BRAND_COLOR;
  const isCustomBrandColor = !!brandColorValue && !popularBrandColors.some((color) => color.toUpperCase() === brandColorValue);
  const brandColorDisplay = brandColorValue ?? defaultBrandColor;
  const colorInputValue = brandColorValue ?? defaultBrandColor;

  React.useEffect(() => {
    setCustomHexDraft(brandColorValue ?? "");
  }, [brandColorValue]);

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

  const chooseBrandLogo = React.useCallback(() => {
    brandUploadRef.current?.click();
  }, []);

  const onBrandLogoSelect = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setValue("brandLogoDataUrl", reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    },
    [setValue]
  );

  const clearBrandLogo = React.useCallback(() => {
    setValue("brandLogoDataUrl", "", { shouldDirty: true });
    if (brandUploadRef.current) {
      brandUploadRef.current.value = "";
    }
  }, [setValue]);

  const brandColorField = register("brandColor");

  return (
    <section className={`${sectionClass} overflow-hidden ${className ?? ""}`}>
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
          <input ref={brandUploadRef} type="file" accept="image/*" className="hidden" onChange={onBrandLogoSelect} />
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
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
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
                    className={`pointer-events-none h-4 w-4 text-white drop-shadow transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
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
  );
};

export default BrandSection;
