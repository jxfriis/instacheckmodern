"use client";

import { motion } from "motion/react";

import { NumberTicker } from "@/components/ui/number-ticker";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

/** Persistent "now at X" goal counter, visible while checking/unchecking. */
export function StickyCounter() {
  const { t } = useI18n();
  const { state, goalRemaining } = useInstaCheckContext();

  if (!state.hasRun || state.followCount === "") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="pointer-events-none fixed bottom-5 right-5 z-40"
    >
      <div className="glass-strong flex items-center gap-2 rounded-full px-4 py-2 shadow-lg shadow-black/10">
        <span className="text-xs font-medium text-muted-foreground">
          {t.goalPrefix}
        </span>
        <NumberTicker
          value={goalRemaining ?? 0}
          className="tabular text-base font-semibold text-foreground"
        />
      </div>
    </motion.div>
  );
}
