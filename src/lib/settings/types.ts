import type { CurrencyCode } from "@/types/entities";

/**
 * Supported UI languages. Romanian is the default and the source language;
 * English is a display-only translation layer.
 */
export type Language = "ro" | "en";

/**
 * Supported color themes. Dark is the product default and matches the
 * existing visual identity; Light is an off-white alternative palette.
 */
export type Theme = "dark" | "light";

/**
 * Persisted user preferences. Stored under {@link PREFS_STORAGE_KEY} in
 * localStorage and applied before first paint by the anti-FOUC script in
 * the root layout.
 */
export type UserPrefs = {
  language: Language;
  currency: CurrencyCode;
  theme: Theme;
};

export const DEFAULT_PREFS: UserPrefs = {
  language: "ro",
  currency: "RON",
  theme: "dark",
};

export const PREFS_STORAGE_KEY = "skysend:user-prefs";
/** Same value is mirrored to a cookie so server components / generateMetadata
 *  can resolve the active language for localized metadata. */
export const PREFS_COOKIE_NAME = "skysend:user-prefs";

export const LANGUAGES: readonly Language[] = ["ro", "en"];
export const CURRENCIES: readonly CurrencyCode[] = ["RON", "EUR"];
export const THEMES: readonly Theme[] = ["dark", "light"];

/**
 * Maps a language to the BCP-47 locale used by {@link Intl.NumberFormat} and
 * for the `<html lang>` attribute.
 */
export const LANGUAGE_LOCALE: Record<Language, string> = {
  ro: "ro-RO",
  en: "en-US",
};