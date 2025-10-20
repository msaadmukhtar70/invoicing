"use client";
import React from "react";

export interface PillOption {
  label: string;
  detail?: string;
}

interface PillSelectProps {
  options: PillOption[];
  value: number;
  onChange: (index: number) => void;
  ariaLabel?: string;
  className?: string;
}

export default function PillSelect({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: PillSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const currentLabel = options[value]?.label ?? options[0]?.label ?? "";
  const currentDetail = options[value]?.detail ?? currentLabel;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleSelect = (index: number) => {
    onChange(index);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((prev) => !prev);
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex w-full items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-brix-blue focus:border-brix-blue focus:ring-2 focus:ring-brix-blue/30"
      >
        <span className="truncate" title={currentDetail}>
          {currentLabel}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-slate-400 transition ${open ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 12 8"
          aria-hidden
        >
          <path
            d="M1.41 0.58L6 5.17l4.59-4.59L12 1.58l-6 6-6-6L1.41.58z"
            fill="currentColor"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[140px] rounded-3xl border border-slate-200 bg-white/95 p-1 shadow-xl backdrop-blur">
          <ul role="listbox" className="max-h-60 overflow-auto">
            {options.map((option, index) => (
              <li key={option.detail ?? option.label}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === index}
                  onClick={() => handleSelect(index)}
                  className={`w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold transition ${
                    value === index
                      ? "bg-brix-blue text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{option.detail ?? option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
