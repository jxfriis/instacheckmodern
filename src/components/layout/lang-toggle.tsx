"use client";

import { Segmented } from "@/components/ui/segmented";
import { locales, type Locale } from "@/i18n";
import { useI18n } from "@/providers/i18n-provider";

export function LangToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <Segmented<Locale>
      label={t.langLabel}
      value={locale}
      onChange={setLocale}
      options={locales.map((l) => ({ value: l, label: l.toUpperCase() }))}
    />
  );
}
