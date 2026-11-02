"use client";

import { useState } from "react";

import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { useInstaCheckContext } from "./context";
import { ProgressPanel } from "./progress-panel";
import { FilterPanel } from "./filter-panel";
import { ActionsPanel } from "./actions-panel";
import { NextUp } from "./next-up";
import { Toolbar } from "./toolbar";
import { FolderChips } from "./folder-chips";
import { UserList } from "./user-list";
import { WatchPanel } from "./watch-panel";
import { NewFolderDialog } from "./new-folder-dialog";

export function Results() {
  const { state, visible } = useInstaCheckContext();
  const [folderTarget, setFolderTarget] = useState<string | null>(null);

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pt-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
      <Reveal dx={-14} dy={0} className="min-w-0 space-y-4">
        <ProgressPanel />
        <FilterPanel />
      </Reveal>

      <Reveal
        delay={50}
        className="min-w-0 space-y-4 lg:col-start-2 lg:row-span-2 lg:row-start-1"
      >
        <NextUp />
        <Panel className="space-y-3">
          <Toolbar />
          <FolderChips />
          <UserList
            visible={visible}
            totalCount={state.unfollowers.length}
            onRequestNewFolder={setFolderTarget}
          />
        </Panel>
        <WatchPanel />
      </Reveal>

      <Reveal delay={100} dx={-14} dy={0} className="min-w-0">
        <ActionsPanel />
      </Reveal>

      <NewFolderDialog
        username={folderTarget}
        open={folderTarget !== null}
        onOpenChange={(open) => {
          if (!open) setFolderTarget(null);
        }}
      />
    </section>
  );
}
