"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

/**
 * Animates a number to its latest value (Magic UI "Number Ticker" pattern).
 * Uses a motion value so updates are GPU-driven and never re-render React.
 */
export function NumberTicker({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const reduced = useReducedMotion();

  useMotionValueEvent(motionValue, "change", (latest) => {
    if (ref.current) {
      ref.current.textContent = Math.round(latest).toLocaleString();
    }
  });

  useEffect(() => {
    if (reduced) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [value, reduced, motionValue]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
    </span>
  );
}
