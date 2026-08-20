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

  const play = () => iconRef.current?.startAnimation();

  return (
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
        <DropdownMenuItem onClick={() => actions.exportFile(true)}>
          {t.exportAll}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => actions.exportFile(false)}>
          {t.exportNoWL}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
