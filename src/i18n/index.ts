import { en, type Messages } from "./en";
import { da } from "./da";

export type { Messages };
export type Locale = "da" | "en";

export const locales = ["da", "en"] as const;

export const DEFAULT_LOCALE: Locale = "da";

export const messages: Record<Locale, Messages> = {
  da,
  en,
};

export const localeLabels: Record<Locale, string> = {
  da: "Dansk",
  en: "English",
};
