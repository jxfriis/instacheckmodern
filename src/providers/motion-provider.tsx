"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";

import { installMotion } from "@/lib/motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => installMotion(), []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
