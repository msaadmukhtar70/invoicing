"use client";
import React from "react";

export type TemplateKey = "1"|"2"|"3"|"4";

export default function TemplateSwitcher({
  value, onChange
}: { value: TemplateKey; onChange: (v: TemplateKey) => void }) {
  const T = [
    { id: "1", name: "Minimal Card" },
    { id: "2", name: "Bright Banner" },
    { id: "3", name: "Classic Split" },
    { id: "4", name: "Bold Header" }
  ] as const;

  return (
    <div className="card p-4">
      <div className="text-sm font-semibold text-slate-700 mb-2">Template</div>
      <div className="grid grid-cols-2 gap-3">
        {T.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id as TemplateKey)}
            type="button"
            className={"rounded-2xl border p-3 text-left transition bg-white hover:bg-slate-50 " + (value===t.id? "border-brix-blue shadow-brix" : "border-slate-200")}
          >
            <div className="font-medium">{t.name}</div>
            <div className="text-xs text-slate-500">Style #{t.id}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
