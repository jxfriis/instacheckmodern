"use client";

import { useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Motion } from "@/lib/motion";

/** Friis's toggle: a knob that springs across a sunken track. */
export function Switch({
  checked,
  onChange,
  children,
  className,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const knob = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  useLayoutEffect(() => {
    if (!knob.current) return;
    const target = checked ? "16px 0px" : "0px 0px";
    if (placed.current) Motion.size(knob.current, "translate", target);
    else knob.current.style.translate = target;
    placed.current = true;
  }, [checked]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "no-press flex w-full items-center justify-between gap-3 rounded-lg text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full",
          checked ? "accent-fill" : "sunken rounded-full"
        )}
      >
        <span
          ref={knob}
          className="switch-knob absolute left-0.5 top-px size-[18px] rounded-full"
        />
      </span>
    </button>
  );
}
