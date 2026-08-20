"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface SpotlightConfig {
  x: number;
  y: number;
  angle: number;
  spread: number;
  radius: number;
  color: [number, number, number];
  alpha: number;
  speed: number;
}

// Spotlights in the InstaCheck gradient palette (orange → pink → purple + blue),
// kept faint so they read as subtle tinted light, not solid beams.
const SPOTLIGHTS: SpotlightConfig[] = [
  {
    x: -0.12,
    y: -0.1,
    angle: Math.PI / 4,
    spread: 0.6,
    radius: 0.9,
    color: [245, 133, 41],
    alpha: 0.32,
    speed: 0.4,
  },
  {
    x: 1.12,
    y: -0.06,
    angle: (Math.PI * 3) / 4,
    spread: 0.55,
    radius: 0.9,
    color: [129, 52, 175],
    alpha: 0.34,
    speed: -0.35,
  },
  {
    x: -0.06,
    y: 1.12,
    angle: -Math.PI / 4,
    spread: 0.6,
    radius: 0.9,
    color: [81, 140, 212],
    alpha: 0.28,
    speed: 0.3,
  },
  {
    x: 1.08,
    y: 1.14,
    angle: (-Math.PI * 3) / 4,
    spread: 0.55,
    radius: 0.95,
    color: [221, 42, 123],
    alpha: 0.32,
    speed: -0.45,
  },
];

const RENDER_SCALE = 0.5;

/**
 * Full-page spotlight background (Aceternity "Spotlight Shader" pattern).
 * Rendered at reduced resolution and blurred via CSS so the beams have the
 * same soft, out-of-focus cone look as the shader. The canvas is transparent,
 * so the theme background shows through.
 */
export function SpotlightShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * RENDER_SCALE);
      canvas.height = Math.floor(height * RENDER_SCALE);
      ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
    };

    const drawSpotlight = (s: SpotlightConfig, t: number) => {
      const maxDim = Math.max(width, height);
      const cx = s.x * width;
      const cy = s.y * height;
      const radius = s.radius * maxDim;
      const angle = s.angle + Math.sin(t * s.speed) * 0.05;
      const [r, g, b] = s.color;
      const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, -s.spread / 2, s.spread / 2);
      ctx.closePath();
      ctx.clip();
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      grad.addColorStop(0, rgba(s.alpha));
      grad.addColorStop(0.35, rgba(s.alpha * 0.6));
      grad.addColorStop(0.7, rgba(s.alpha * 0.22));
      grad.addColorStop(1, rgba(0));
      ctx.fillStyle = grad;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.restore();
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of SPOTLIGHTS) drawSpotlight(s, t);
    };

    let start = 0;
    const loop = (time: number) => {
      if (!start) start = time;
      render((time - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduced) {
      render(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        start = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed -inset-8 -z-10 blur-2xl",
        className
      )}
    />
  );
}
