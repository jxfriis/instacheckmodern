"use client";

import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { InboxIcon, SearchXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";
import { UserRow } from "./user-row";

export function UserList({
  visible,
  totalCount,
  onRequestNewFolder,
}: {
  visible: string[];
  totalCount: number;
  onRequestNewFolder: (u: string) => void;
}) {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();
  const parentRef = useRef<HTMLDivElement>(null);

  // TanStack Virtual's `useVirtualizer` isn't React Compiler-memoizable;
  // skipping optimization here is fine for a windowed list.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: visible.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 54,
    overscan: 10,
  });

  // A different view starts from the top.
  useEffect(() => {
    parentRef.current?.scrollTo({ top: 0 });
  }, [state.filterMode, state.activeFolder, state.searchQ, state.sortMode]);

  if (visible.length === 0) {
    const allClear = totalCount === 0;
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <div className="raised grid size-12 place-items-center rounded-2xl text-muted-foreground">
          {allClear ? (
            <InboxIcon className="size-6" />
          ) : (
            <SearchXIcon className="size-6" />
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-foreground">
          {allClear ? t.noResults : t.noMatch}
        </p>
        {allClear ? (
          <p className="max-w-xs text-xs text-muted-foreground">
            {t.noResultsSub}
          </p>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={() => {
              actions.setFilter("all");
              actions.setSearch("");
              actions.setActiveFolder(null);
            }}
          >
            {t.clearFilters}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="relative max-h-[58vh] overflow-y-auto overscroll-contain pr-1"
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
          width: "100%",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={visible[item.index]}
            ref={virtualizer.measureElement}
            data-index={item.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${item.start}px)`,
            }}
          >
            <UserRow
              u={visible[item.index]}
              onRequestNewFolder={onRequestNewFolder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
