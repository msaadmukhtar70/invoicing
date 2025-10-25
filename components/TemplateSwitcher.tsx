"use client";
import React from "react";

export type TemplateKey = "1" | "2" | "3" | "4" | "5";

const templates = [
  { id: "1", name: "Minimal Card", subtitle: "Style #1" },
  { id: "2", name: "Bright Banner", subtitle: "Style #2" },
  { id: "3", name: "Classic Split", subtitle: "Style #3" },
  { id: "4", name: "Bold Header", subtitle: "Style #4" },
  { id: "5", name: "Professional Clean", subtitle: "Style #5" },
] as const;

export default function TemplateSwitcher({
  value,
  onChange,
}: {
  value: TemplateKey;
  onChange: (v: TemplateKey) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="rounded-2xl bg-[#F3F6FD] px-5 py-3 text-sm font-semibold text-slate-700">Template</div>
      <p className="text-xs text-slate-500">
        Pick a layout style to visualize your invoice before exporting.
      </p>
      <div className="space-y-3 pt-1">
        {templates.map((template) => {
          const isActive = template.id === value;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id as TemplateKey)}
              className={`group relative flex w-full items-center justify-between gap-4 rounded-[24px] border bg-white px-5 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brix-blue/40 ${
                isActive
                  ? "border-brix-blue/60 shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-[0_8px_16px_rgba(15,23,42,0.06)]"
              }`}
            >
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
              <span className={`text-[11px] font-semibold uppercase tracking-wide ${isActive ? "text-brix-blue" : "text-slate-400 group-hover:text-slate-500"}`}>
                {isActive ? "Active" : "Select"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
