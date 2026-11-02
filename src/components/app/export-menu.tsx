"use client";

import { useRef } from "react";
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
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

export function ExportMenu() {
  const { t } = useI18n();
  const { actions } = useInstaCheckContext();
  const iconRef = useRef<AnimatedIconHandle | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            onMouseEnter={() => iconRef.current?.startAnimation()}
          >
            <CloudDownloadIcon ref={iconRef} size={16} className="[&_svg]:block" />
            {t.export}
            <ChevronDownIcon className="size-3.5 opacity-60" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-auto min-w-64">
        <DropdownMenuItem onClick={actions.exportProgress}>
          <span>
            <span className="block font-medium">{t.exportProgress}</span>
            <span className="block text-xs text-muted-foreground">
              {t.exportProgressSub}
            </span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={actions.exportRemaining}>
          <span>
            <span className="block font-medium">{t.exportRemaining}</span>
            <span className="block text-xs text-muted-foreground">
              {t.exportRemainingSub}
            </span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
