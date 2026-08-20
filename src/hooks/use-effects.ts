"use client";

import { useCallback } from "react";
import { useReducedMotion } from "motion/react";

function spawnRipple(
  x: number,
  y: number,
  colors: string[],
  sizes: number[],
  count: number
) {
  for (let i = 0; i < count; i++) {
    const ring = document.createElement("div");
    ring.className = "ripple-ring";
    ring.setAttribute("aria-hidden", "true");
    const size = sizes[i % sizes.length] + (Math.random() * 30 - 15);
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.width = `${size}px`;
    ring.style.height = `${size}px`;
    ring.style.color = colors[i % colors.length];
    ring.style.animationDelay = `${i * 60}ms`;
    ring.style.animationDuration = `${620 + i * 50}ms`;
    document.body.appendChild(ring);
    window.setTimeout(() => ring.remove(), 1000 + i * 80);
  }
}

function spawnShimmer() {
  const el = document.createElement("div");
  el.className = "milestone-shimmer";
  el.setAttribute("aria-hidden", "true");
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 1000);
}

export function useEffects() {
  const reducedMotion = useReducedMotion();
  const enabled = !reducedMotion;

  const milestoneBurst = useCallback(() => {
    if (!enabled) return;
    spawnShimmer();
    spawnRipple(
      window.innerWidth / 2,
      window.innerHeight / 2,
      ["#ffd166", "#f58529", "#dd2a7b", "#518cd4", "#8134af"],
      [60, 110, 170, 240, 310],
      5
    );
  }, [enabled]);

  return { milestoneBurst };
}
