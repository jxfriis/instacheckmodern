"use client";

import { ArrowUpDownIcon } from "lucide-react";

import { Search01Icon } from "@/components/ui/search-01";
import { SORT_MODES } from "@/lib/instacheck/selectors";
import type { SortMode } from "@/lib/instacheck/types";
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

export function Toolbar() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();

  const sortLabels: Record<SortMode, string> = {
    az: t.sortAZ,
    za: t.sortZA,
    pending: t.sortPending,
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Search01Icon
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:block"
        />
        <input
          type="search"
          value={state.searchQ}
          onChange={(e) => actions.setSearch(e.target.value)}
          placeholder={t.search}
          aria-label={t.search}
          className="sunken h-[38px] w-full pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline">
              <ArrowUpDownIcon className="size-3.5" />
              {sortLabels[state.sortMode]}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-auto min-w-40">
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
  );
}
