"use client";

import { useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Motion } from "@/lib/motion";

/** Friis's sliding pill: a raised pill springs across a sunken track to the picked option. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  const pill = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  const index = options.findIndex((o) => o.value === value);

  useLayoutEffect(() => {
    if (!pill.current) return;
    const target = `${index * 100}% 0px`;
    if (placed.current) Motion.size(pill.current, "translate", target);
    else pill.current.style.translate = target;
    placed.current = true;
  }, [index]);

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("sunken relative inline-flex rounded-[11px] p-0.5", className)}
    >
      <span className="absolute inset-0.5">
        <span
          ref={pill}
          aria-hidden
          className="raised block h-full rounded-[9px]"
          style={{ width: `${100 / options.length}%` }}
        />
      </span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "no-press relative h-7 w-10 rounded-[9px] text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
            o.value === value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
