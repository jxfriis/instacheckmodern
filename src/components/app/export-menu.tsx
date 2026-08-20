"use client";

import { useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import { Button } from "@/components/ui/button";
import { CloudDownloadIcon } from "@/components/ui/cloud-download";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function ExportMenu() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();
  const iconRef = useRef<AnimatedIconHandle | null>(null);
  const [pending, setPending] = useState<boolean | null>(null);

  const play = () => iconRef.current?.startAnimation();

  const handleExport = (includeWL: boolean) => {
    if (state.followCount === "") {
      actions.exportFile(includeWL, false);
      return;
    }
    setPending(includeWL);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="gap-1.5" onMouseEnter={play}>
              <CloudDownloadIcon
                ref={iconRef}
                size={16}
                className="[&_svg]:block"
              />
              {t.export}
              <ChevronDownIcon className="size-3.5 opacity-60" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport(true)}>
            {t.exportAll}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport(false)}>
            {t.exportNoWL}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t.exportFollowTitle}</DialogTitle>
            <DialogDescription>
              {t.exportFollowDesc.replace("{n}", state.followCount)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                actions.exportFile(pending ?? true, false);
                setPending(null);
              }}
            >
              {t.exportFollowSkip}
            </Button>
            <Button
              onClick={() => {
                actions.exportFile(pending ?? true, true);
                setPending(null);
              }}
            >
              {t.exportFollowInclude}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
