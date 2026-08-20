"use client";

import { FolderIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

export function FolderChips() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();

  if (state.folders.size === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {t.foldersLabel}
      </span>
      {Array.from(state.folders.keys()).map((name) => {
        const active = state.activeFolder === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() =>
              actions.setActiveFolder(active ? null : name)
            }
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? "border-ig-purple/40 bg-ig-purple/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <FolderIcon className="size-3.5" />
            {name}
            <span className="tabular text-[10px] opacity-70">
              {state.folders.get(name)?.size ?? 0}
            </span>
            {active && <XIcon className="size-3" />}
          </button>
        );
      })}
    </div>
  );
}
