"use client";

import { cn } from "@/lib/utils";

/**
 * Gradient text with a slow, continuous shimmer (Magic UI
 * "Animated Gradient Text" pattern).
 */
export function AnimatedGradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-gradient gradient-shimmer inline-block",
        className
      )}
    >
      {children}
    </span>
  );
}
