"use client";
import React from "react";

export type TemplateKey = "1" | "2" | "3" | "4";

const templates = [
  { id: "1", name: "Minimal Card", subtitle: "Style #1" },
  { id: "2", name: "Bright Banner", subtitle: "Style #2" },
  { id: "3", name: "Classic Split", subtitle: "Style #3" },
  { id: "4", name: "Bold Header", subtitle: "Style #4" },
] as const;

export default function TemplateSwitcher({
  value,
  onChange,
}: {
  value: TemplateKey;
  onChange: (v: TemplateKey) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white shadow-soft p-6 md:p-7">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-100/70 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-2 h-24 rounded-[28px] bg-slate-50/80 blur-xl" />
      <div className="relative z-10 space-y-4">
        <div className="space-y-1">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Template</h2>
          <p className="text-xs text-slate-500">
            Pick a layout style to visualize your invoice before exporting.
          </p>
        </div>
        <div className="space-y-3">
          {templates.map((template) => {
            const isActive = template.id === value;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onChange(template.id as TemplateKey)}
                className={`group relative flex w-full items-center justify-between gap-4 rounded-[24px] border bg-white px-5 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brix-blue/40 ${
                  isActive
                    ? "border-brix-blue/60 shadow-[0_16px_32px_rgba(15,23,42,0.1)]"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-[0_12px_26px_rgba(15,23,42,0.08)]"
                }`}
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 rounded-[24px] border border-white/80 bg-gradient-to-br from-white via-white to-slate-50 transition duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <div className="relative z-10 flex min-w-0 flex-1 items-center gap-4">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 transition group-hover:scale-[1.03]"
                  >
                    #{template.id}
                  </span>
                  <div className="min-w-0 leading-tight">
                    <div className="truncate text-sm font-semibold text-slate-800">{template.name}</div>
                    <div className="text-xs font-medium text-slate-500">{template.subtitle}</div>
                  </div>
                </div>
                <span className={`relative z-10 text-[11px] font-semibold uppercase tracking-wide ${isActive ? "text-brix-blue" : "text-slate-400 group-hover:text-slate-500"}`}>
                  {isActive ? "Active" : "Select"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
