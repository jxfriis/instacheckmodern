"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const dotColors = {
  gradient: ["bg-ig-orange", "bg-ig-pink", "bg-ig-purple"],
  current: ["bg-current", "bg-current", "bg-current"],
} as const;

/** Three dots pulsing in sequence — the "thinking" indicator. */
export function DotsLoader({
  className,
  size = "size-1.5",
  color = "gradient",
}: {
  className?: string;
  size?: string;
  color?: keyof typeof dotColors;
}) {
  const colors = dotColors[color];
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {colors.map((c, i) => (
        <motion.span
          key={i}
          className={cn("rounded-full", size, c)}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}
