"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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

export function NewFolderDialog({
  username,
  open,
  onOpenChange,
}: {
  username: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const { actions } = useInstaCheckContext();
  const [name, setName] = useState("");

  const confirm = () => {
    if (!username) return;
    const target = name.trim();
    if (!target) return;
    actions.addToFolder(username, target);
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setName("");
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t.nfTitle}</DialogTitle>
          <DialogDescription>
            {username ? `@${username}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <label
            htmlFor="new-folder-input"
            className="text-xs font-medium text-muted-foreground"
          >
            {t.nfNewLbl}
          </label>
          <input
            id="new-folder-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirm();
            }}
            placeholder={t.nfPlaceholder}
            autoFocus
            className="sunken h-10 w-full px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.nfCancel}
          </Button>
          <Button onClick={confirm} disabled={!name.trim()}>
            {t.nfConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
