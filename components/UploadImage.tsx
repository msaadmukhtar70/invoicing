"use client";
import React from "react";

export default function UploadImage({
  label,
  value,
  onChange,
  circle = false,
  hideLabel = false,
}: {
  label: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  circle?: boolean;
  hideLabel?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const pick = () => inputRef.current?.click();
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {!hideLabel && <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>}
      <div className="flex items-center justify-between gap-4">
        <div
          className={
            "flex items-center justify-center overflow-hidden border border-slate-200 bg-slate-50 shadow-inner " +
            (circle ? "size-20 rounded-full" : "h-20 w-28 rounded-2xl")
          }
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="uploaded" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-medium text-slate-400">No image</span>
          )}
        </div>
        <button type="button" className="btn" onClick={pick}>
          Upload
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handle} />
      </div>
    </div>
  );
}
