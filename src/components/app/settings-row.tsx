"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

export function SettingsRow() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex-1 space-y-1.5">
        <label
          htmlFor="goal-input"
          className="text-xs font-medium text-muted-foreground"
        >
          {t.followLbl}
        </label>
        <input
          id="goal-input"
          type="text"
          inputMode="numeric"
          value={state.followCount}
          onChange={(e) =>
            actions.setFollowCount(e.target.value.replace(/[^0-9]/g, ""))
          }
          placeholder={t.goalPlaceholder}
          className="tabular h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={state.autoWhitelistOnFolder}
        onClick={actions.toggleAutoWL}
        className="inline-flex items-center gap-2.5 rounded-lg border border-border px-3 py-2 transition-colors hover:bg-muted/40"
      >
        <span className="text-xs font-medium text-muted-foreground">
          {t.autoWLLabel}
        </span>
        <span
          className={cn(
            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
            state.autoWhitelistOnFolder ? "bg-ig-pink" : "bg-muted-foreground/30"
          )}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className={cn(
              "absolute size-4 rounded-full bg-white shadow-sm",
              state.autoWhitelistOnFolder ? "right-0.5" : "left-0.5"
            )}
          />
        </span>
      </button>
    </div>
  );
}
