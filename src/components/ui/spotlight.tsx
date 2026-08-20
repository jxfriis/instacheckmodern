"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * A soft radial glow that follows the cursor within its parent container.
 * Uses motion values (no React re-renders) — Aceternity "Spotlight" pattern.
 */
export function Spotlight({
  className,
  radius = 480,
  color = "rgba(221,42,123,0.10)",
}: {
  className?: string;
  radius?: number;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, ${color}, transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      aria-hidden
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      style={{ background }}
      className={cn("pointer-events-none absolute inset-0", className)}
    />
  );
}
