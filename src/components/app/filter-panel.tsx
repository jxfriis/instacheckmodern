"use client";

import { cn } from "@/lib/utils";
import { Panel } from "@/components/ui/panel";
import { usePopOnChange } from "@/components/ui/reveal";
import { FILTER_MODES, getFilterCounts } from "@/lib/instacheck/selectors";
import type { FilterMode } from "@/lib/instacheck/types";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

const filterDot: Record<FilterMode, string> = {
  all: "bg-foreground/60",
  pending: "bg-foreground/60",
  done: "bg-ig-pink",
  wl: "bg-wl",
  skip: "bg-skip",
  watch: "bg-watch",
};

function FilterButton({
  label,
  dot,
  count,
  active,
  onClick,
}: {
  label: string;
  dot: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const countRef = usePopOnChange<HTMLSpanElement>(count);

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex-row lg:items-center lg:justify-between lg:gap-2 lg:text-sm",
        active
          ? "raised font-semibold text-foreground"
          : "border border-b-[3px] border-transparent text-muted-foreground hover:bg-[var(--hover)] hover:text-foreground"
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className={cn("size-2 shrink-0 rounded-full", dot)} />
        <span className="truncate">{label}</span>
      </span>
      <span ref={countRef} className="tabular font-display font-semibold text-foreground">
        {count.toLocaleString()}
      </span>
    </button>
  );
}

export function FilterPanel() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();
  const counts = getFilterCounts(state);

  const labels: Record<FilterMode, string> = {
    all: t.filterAll,
    pending: t.filterPending,
    done: t.filterDone,
    wl: t.filterWL,
    skip: t.filterSkip,
    watch: t.filterWatch,
  };

  return (
    <Panel className="p-2 sm:p-2">
      <div
        role="group"
        aria-label={t.filtersLabel}
        className="grid grid-cols-3 gap-1 lg:grid-cols-1"
      >
        {FILTER_MODES.map((mode) => (
          <FilterButton
            key={mode}
            label={labels[mode]}
            dot={filterDot[mode]}
            count={counts[mode]}
            active={state.filterMode === mode}
            onClick={() => actions.setFilter(mode)}
          />
        ))}
      </div>
    </Panel>
  );
}
