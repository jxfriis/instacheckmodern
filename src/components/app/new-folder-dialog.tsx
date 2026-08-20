"use client";

import { useState } from "react";
import { FolderIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
  const { state, actions } = useInstaCheckContext();
  const [name, setName] = useState("");

  const folders = Array.from(state.folders.keys());

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

        {folders.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t.nfExistingLbl}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {folders.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    if (username) actions.addToFolder(username, f);
                    onOpenChange(false);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:border-ring/40 hover:text-foreground"
                >
                  <FolderIcon className="size-3.5" />
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

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
            className={cn(
              "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors",
              "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            )}
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
