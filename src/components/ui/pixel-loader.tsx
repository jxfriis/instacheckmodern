"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const COLS = 5;
const ROWS = 3;

/**
 * Pixel-grid loader with a "drive" sweep + shimmer and an elapsed-time readout
 * (beautifului.dev "Loading State" pattern).
 */
export function PixelLoader({
  elapsed,
  className,
}: {
  elapsed: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: COLS * ROWS }).map((_, i) => (
          <motion.span
            key={i}
            className="size-2.5 rounded-[3px] bg-gradient-ig"
            animate={{ opacity: [0.15, 1, 0.15], scale: [1, 0.72, 1] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="tabular min-w-9 text-xs font-medium text-muted-foreground">
        {elapsed.toFixed(1)}s
      </span>
    </div>
  );
}
