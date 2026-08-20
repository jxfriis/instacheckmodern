"use client";

import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass relative overflow-hidden rounded-2xl p-4 shadow-sm sm:p-5",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
      />
      {children}
    </div>
  );
}
