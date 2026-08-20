"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { GlassCard } from "@/components/ui/section-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClipboardIcon } from "@/components/ui/clipboard";
import { UndoIcon } from "@/components/ui/undo";
import { RefreshIcon } from "@/components/ui/refresh";
import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";
import { Stats } from "./stats";
import { SettingsRow } from "./settings-row";
import { Toolbar } from "./toolbar";
import { FolderChips } from "./folder-chips";
import { UserList } from "./user-list";
import { WatchPanel } from "./watch-panel";
import { ExportMenu } from "./export-menu";
import { NewFolderDialog } from "./new-folder-dialog";

export function Results() {
  const { t } = useI18n();
  const { state, visible, actions } = useInstaCheckContext();
  const [folderTarget, setFolderTarget] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const copyRef = useRef<AnimatedIconHandle | null>(null);
  const undoRef = useRef<AnimatedIconHandle | null>(null);
  const refreshRef = useRef<AnimatedIconHandle | null>(null);

  const playCopy = () => copyRef.current?.startAnimation();
  const playUndo = () => undoRef.current?.startAnimation();
  const playRefresh = () => refreshRef.current?.startAnimation();

  return (
    <AnimatePresence>
      {state.hasRun && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-2xl space-y-4 px-4 pt-6"
        >
          <GlassCard>
            <Stats />
            <Separator className="my-4" />
            <SettingsRow />
          </GlassCard>

          <GlassCard>
            <Toolbar />
          </GlassCard>

          <GlassCard>
            <div className="mb-3">
              <FolderChips />
            </div>
            <UserList
              visible={visible}
              totalCount={state.unfollowers.length}
              onRequestNewFolder={setFolderTarget}
            />
            <Separator className="my-3" />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  actions.copyRemaining();
                  playCopy();
                }}
                onMouseEnter={playCopy}
                className="gap-1.5"
              >
                <ClipboardIcon
                  ref={copyRef}
                  size={16}
                  className="[&_svg]:block"
                />
                {t.copyAll}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setResetOpen(true);
                  playUndo();
                }}
                onMouseEnter={playUndo}
                className="gap-1.5"
              >
                <UndoIcon
                  ref={undoRef}
                  size={16}
                  className="[&_svg]:block"
                />
                {t.clearDone}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  actions.rescan();
                  playRefresh();
                }}
                onMouseEnter={playRefresh}
                className="gap-1.5"
              >
                <RefreshIcon
                  ref={refreshRef}
                  size={16}
                  className="[&_svg]:block"
                />
                {t.rescan}
              </Button>
              <div className="ml-auto">
                <ExportMenu />
              </div>
            </div>
          </GlassCard>

          <WatchPanel />

          <NewFolderDialog
            username={folderTarget}
            open={folderTarget !== null}
            onOpenChange={(open) => {
              if (!open) setFolderTarget(null);
            }}
          />

          <Dialog open={resetOpen} onOpenChange={setResetOpen}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>{t.resetTitle}</DialogTitle>
                <DialogDescription>{t.resetDesc}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setResetOpen(false)}>
                  {t.nfCancel}
                </Button>
                <Button
                  onClick={() => {
                    actions.resetChecked();
                    setResetOpen(false);
                  }}
                >
                  {t.clearDone}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
