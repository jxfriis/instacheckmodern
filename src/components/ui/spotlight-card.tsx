"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Glass card with a cursor-following spotlight + gradient hover border —
 * combines Aceternity "Card Spotlight" and "Hover Border Gradient".
 */
export function SpotlightCard({
  className,
  children,
  glow = "rgba(221,42,123,0.12)",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { glow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);

  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, ${glow}, transparent 72%)`;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      className={cn(
        "glass group relative overflow-hidden rounded-2xl p-4 shadow-sm sm:p-5",
        className
      )}
      {...props}
    >
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: "1px",
          background:
            "linear-gradient(135deg, rgba(245,133,41,0.45), rgba(221,42,123,0.45), rgba(129,52,175,0.45)) border-box",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
