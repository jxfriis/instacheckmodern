"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { Reveal, usePopOnChange } from "@/components/ui/reveal";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

/** Persistent "you now follow X" counter, visible while checking/unchecking. */
export function StickyCounter() {
  const { t } = useI18n();
  const { state, goalRemaining } = useInstaCheckContext();
  const ref = usePopOnChange<HTMLDivElement>(goalRemaining, 0.9);

  if (!state.hasRun || state.followCount === "") return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40">
      <Reveal kind="pop">
        <div
          ref={ref}
          className="panel flex items-center gap-2 rounded-full px-4 py-2"
        >
          <span className="text-xs font-medium text-muted-foreground">
            {t.goalPrefix}
          </span>
          <NumberTicker
            value={goalRemaining ?? 0}
            className="tabular font-display text-base font-semibold text-foreground"
          />
        </div>
      </Reveal>
    </div>
  );
}
