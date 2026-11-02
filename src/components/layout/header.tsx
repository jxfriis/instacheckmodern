"use client";

import { useRef } from "react";

import type { AnimatedIconHandle } from "@/lib/use-icon-animation";
import { Button } from "@/components/ui/button";
import { RefreshIcon } from "@/components/ui/refresh";
import { useInstaCheckContext } from "@/components/app/context";
import { useI18n } from "@/providers/i18n-provider";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LangToggle } from "./lang-toggle";

export function Header() {
  const { t } = useI18n();
  const { state, actions } = useInstaCheckContext();
  const iconRef = useRef<AnimatedIconHandle | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />
        <div className="flex items-center gap-2">
          {state.hasRun && (
            <Button
              variant="outline"
              size="sm"
              onClick={actions.rescan}
              onMouseEnter={() => iconRef.current?.startAnimation()}
              aria-label={t.newCompare}
            >
              <RefreshIcon ref={iconRef} size={15} className="[&_svg]:block" />
              <span className="hidden sm:inline">{t.newCompare}</span>
            </Button>
          )}
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
