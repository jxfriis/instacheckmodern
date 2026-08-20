"use client";

import { ArrowUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Search01Icon } from "@/components/ui/search-01";
import {
  getFilterCounts,
  SORT_MODES,
  FILTER_MODES,
} from "@/lib/instacheck/selectors";
import type { FilterMode, SortMode } from "@/lib/instacheck/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

const filterAccent: Record<FilterMode, string> = {
  all: "",
  pending: "",
  done: "",
  wl: "text-wl-fg data-[active=true]:border-wl/40 data-[active=true]:bg-wl/10",
  skip: "text-skip-fg data-[active=true]:border-skip/40 data-[active=true]:bg-skip/10",
  watch:
    "text-watch-fg data-[active=true]:border-watch/40 data-[active=true]:bg-watch/10",
};

const filterDot: Record<FilterMode, string> = {
  all: "bg-foreground/40",
  pending: "bg-foreground/40",
  done: "bg-ig-pink",
  wl: "bg-wl",
  skip: "bg-skip",
  watch: "bg-watch",
};

export function Toolbar() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();
  const counts = getFilterCounts(state);

  const filterLabels: Record<FilterMode, string> = {
    all: t.filterAll,
    pending: t.filterPending,
    done: t.filterDone,
    wl: t.filterWL,
    skip: t.filterSkip,
    watch: t.filterWatch,
  };

  const sortLabels: Record<SortMode, string> = {
    az: t.sortAZ,
    za: t.sortZA,
    pending: t.sortPending,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search01Icon
            size={16}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:block"
          />
          <input
            type="search"
            value={state.searchQ}
            onChange={(e) => actions.setSearch(e.target.value)}
            placeholder={t.search}
            className="h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="default" className="h-9 gap-1.5">
                <ArrowUpDownIcon className="size-3.5" />
                {sortLabels[state.sortMode]}
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={state.sortMode}
              onValueChange={(v) => actions.setSort(v as SortMode)}
            >
              {SORT_MODES.map((mode) => (
                <DropdownMenuRadioItem key={mode} value={mode}>
                  {sortLabels[mode]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTER_MODES.map((mode) => {
          const active = state.filterMode === mode;
          return (
            <button
              key={mode}
              type="button"
              data-active={active}
              onClick={() => actions.setFilter(mode)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                active && "border-ring/40 bg-muted/60 text-foreground",
                filterAccent[mode]
              )}
            >
              <span className={cn("size-1.5 rounded-full", filterDot[mode])} />
              {filterLabels[mode]}
              <span className="tabular text-[10px] opacity-70">
                {counts[mode]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
