"use client";

import { FolderIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFolderCount } from "@/lib/instacheck/selectors";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

export function FolderChips() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();

  if (state.folders.size === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-medium text-muted-foreground">
        {t.foldersLabel}
      </span>
      {Array.from(state.folders.keys()).map((name) => {
        const active = state.activeFolder === name;
        return (
          <Button
            key={name}
            variant={active ? "outline" : "ghost"}
            size="xs"
            aria-pressed={active}
            onClick={() => actions.setActiveFolder(active ? null : name)}
          >
            <FolderIcon />
            {name}
            <span className="tabular text-[10px] opacity-70">
              {getFolderCount(state, name)}
            </span>
            {active && <XIcon />}
          </Button>
        );
      })}
    </div>
  );
}
