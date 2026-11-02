"use client";

import { ShieldCheckIcon } from "lucide-react";

import { useI18n } from "@/providers/i18n-provider";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8">
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheckIcon className="size-3.5 shrink-0" />
        {t.privacyNote}
      </p>
    </footer>
  );
}
