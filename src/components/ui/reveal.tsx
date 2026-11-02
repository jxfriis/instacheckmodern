"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { Motion } from "@/lib/motion";

/** Springs its content in once, when it mounts. */
export function Reveal({
  kind = "enter",
  dx = 0,
  dy = 16,
  delay = 0,
  className,
  children,
}: {
  kind?: "enter" | "pop";
  dx?: number;
  dy?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    if (kind === "pop") Motion.popIn(ref.current, delay);
    else Motion.enter(ref.current, dx, dy, delay);
    // Only ever plays on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** A little bounce on the returned element whenever `value` changes. */
export function usePopOnChange<T extends HTMLElement>(value: unknown, from = 0.86) {
  const ref = useRef<T>(null);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    if (ref.current) Motion.pop(ref.current, from);
  }, [value, from]);

  return ref;
}
