"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { useLocalStorageState } from "@/hooks/use-local-storage";
import { DEFAULT_LOCALE, messages, type Locale, type Messages } from "@/i18n";

const STORAGE_KEY = "instacheck-locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useLocalStorageState<Locale>(
    STORAGE_KEY,
    DEFAULT_LOCALE
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => setLocaleState(next),
    [setLocaleState]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t: messages[locale] }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
