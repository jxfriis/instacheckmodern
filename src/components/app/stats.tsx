"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import { getFilterCounts } from "@/lib/instacheck/selectors";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

const statColors = [
  "text-foreground",
  "text-ig-pink",
  "text-foreground",
  "text-wl-fg",
  "text-skip-fg",
  "text-watch-fg",
];

const statDots = [
  "bg-foreground/70",
  "bg-ig-pink",
  "bg-foreground/70",
  "bg-wl",
  "bg-skip",
  "bg-watch",
];

export function Stats() {
  const { t } = useI18n();
  const { state, progress, goalRemaining } = useInstaCheckContext();

  const counts = getFilterCounts(state);
  const stats = [
    { label: t.statAll, value: counts.all },
    { label: t.statDone, value: counts.done },
    { label: t.statLeft, value: counts.pending },
    { label: t.statWL, value: counts.wl },
    { label: t.statSkip, value: counts.skip },
    { label: t.statWatch, value: counts.watch },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {progress}%
          </span>
          {goalRemaining !== null && (
            <span className="tabular text-xs font-medium text-muted-foreground">
              · {t.goalPrefix} {goalRemaining}
            </span>
          )}
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-ig"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-muted/20 px-3 py-2.5"
          >
            <div
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
              )}
            >
              <span className={cn("size-1.5 rounded-full", statDots[i])} />
              {s.label}
            </div>
            <div
              className={cn(
                "tabular mt-1 text-lg font-semibold leading-none",
                statColors[i]
              )}
            >
              <NumberTicker value={s.value} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
