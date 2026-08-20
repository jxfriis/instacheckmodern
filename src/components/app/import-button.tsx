"use client";

import { useRef } from "react";

import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import { Button } from "@/components/ui/button";
import { CloudUploadIcon } from "@/components/ui/cloud-upload";
import { useI18n } from "@/providers/i18n-provider";
import { useInstaCheckContext } from "./context";

export function ImportButton({ className }: { className?: string }) {
  const { t } = useI18n();
  const { actions } = useInstaCheckContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<AnimatedIconHandle | null>(null);

  const play = () => iconRef.current?.startAnimation();

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          inputRef.current?.click();
          play();
        }}
        onMouseEnter={play}
        className={className}
      >
        <CloudUploadIcon
          ref={iconRef}
          size={16}
          className="[&_svg]:block"
        />
        {t.import}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            try {
              actions.importFromFile(await file.text());
            } catch {
              /* ignore unreadable file */
            }
          }
          e.target.value = "";
        }}
      />
    </>
  );
}
