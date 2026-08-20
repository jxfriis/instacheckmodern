"use client";

import { ShieldCheckIcon } from "lucide-react";

import { useI18n } from "@/providers/i18n-provider";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mx-auto mt-16 w-full max-w-2xl px-4 pb-10">
      <div className="flex flex-col items-center gap-4 border-t border-border/60 pt-8 text-center">
        <Logo />
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheckIcon className="size-3.5" />
          {t.privacyNote}
        </p>
      </div>
    </footer>
  );
}
