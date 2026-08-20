"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { locales } from "@/i18n";
import { useI18n } from "@/providers/i18n-provider";

export function LangToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-full border border-border bg-muted/40 p-0.5"
    >
      {locales.map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            className={cn(
              "relative rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-indicator"
                className="absolute inset-0 rounded-full bg-card shadow-sm ring-1 ring-border"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{l === "da" ? "DA" : "EN"}</span>
          </button>
        );
      })}
    </div>
  );
}
