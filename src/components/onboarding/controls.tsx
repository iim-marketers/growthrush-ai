"use client";

import { cn } from "@/lib/utils";

/** Label + control pair, so every question in the flow is spaced the same. */
export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="mb-2.5 text-sm font-semibold text-ink">{label}</p>
      {children}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  icon,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Optional leading glyph, matching the reference flow's inset icons. */
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-4 transition-all focus-within:border-brand focus-within:bg-white/6 focus-within:ring-[3px] focus-within:ring-brand/15">
      {icon && <span className="shrink-0 text-faint">{icon}</span>}
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full min-w-0 flex-1 bg-transparent py-3.5 text-base text-ink outline-none placeholder:text-faint"
      />
    </div>
  );
}

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        selected
          ? "border-brand bg-brand/15 text-ink"
          : "border-white/10 bg-white/3 text-subtle hover:border-white/20 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
