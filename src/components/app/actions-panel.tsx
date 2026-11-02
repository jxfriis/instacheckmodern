"use client";

import { useRef, useState } from "react";
import { Trash2Icon } from "lucide-react";

import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Switch } from "@/components/ui/switch";
import { ClipboardIcon } from "@/components/ui/clipboard";
import { UndoIcon } from "@/components/ui/undo";
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
import { ExportMenu } from "./export-menu";

export function ActionsPanel() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();
  const [clearOpen, setClearOpen] = useState(false);

  const copyRef = useRef<AnimatedIconHandle | null>(null);
  const undoRef = useRef<AnimatedIconHandle | null>(null);

  const playCopy = () => copyRef.current?.startAnimation();
  const playUndo = () => undoRef.current?.startAnimation();

  return (
    <Panel className="space-y-4">
      <h2 className="text-sm font-semibold">{t.actionsTitle}</h2>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <Button
          variant="outline"
          onClick={() => {
            actions.copyRemaining();
            playCopy();
          }}
          onMouseEnter={playCopy}
        >
          <ClipboardIcon ref={copyRef} size={16} className="[&_svg]:block" />
          {t.copyAll}
        </Button>
        <ExportMenu />
        <Button
          variant="outline"
          disabled={state.checked.size === 0}
          onClick={() => {
            actions.resetChecked();
            playUndo();
          }}
          onMouseEnter={playUndo}
        >
          <UndoIcon ref={undoRef} size={16} className="[&_svg]:block" />
          {t.clearDone}
        </Button>
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => setClearOpen(true)}
        >
          <Trash2Icon />
          {t.clearAll}
        </Button>
      </div>

      <Switch
        checked={state.autoWhitelistOnFolder}
        onChange={actions.toggleAutoWL}
      >
        {t.autoWLLabel}
      </Switch>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t.clearAllTitle}</DialogTitle>
            <DialogDescription>{t.clearAllDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearOpen(false)}>
              {t.nfCancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setClearOpen(false);
                actions.clearAll();
              }}
            >
              {t.clearAllConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}
