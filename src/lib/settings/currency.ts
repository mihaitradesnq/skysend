import type { CurrencyCode } from "@/types/entities";
import { LANGUAGE_LOCALE, type Language } from "@/lib/settings/types";

/**
 * Static exchange rate used by the display-only currency toggle. Calculations
 * always run in RON minor; this rate only changes how values are formatted.
 * Configurable later via operational settings.
 */
export const EXCHANGE_RON_PER_EUR = 4.97;

/**
 * Format a price stored as minor units (e.g. cents /bani).
 *
 * The function is the single source of truth for money rendering across the
 * application. It is *display-only*: switching the {@link targetCurrency}
 * never affects the underlying RON minor calculation; it converts at
 * {@link EXCHANGE_RON_PER_EUR} and re-formats with the requested locale.
 */
export function formatMoneyMinor(
  amountMinor: number,
  options: {
    targetCurrency?: CurrencyCode;
    locale?: string;
  } = {},
): string {
  const targetCurrency = options.targetCurrency ?? "RON";
  const locale = options.locale ?? "ro-RO";

  const converted = convertMinorForDisplay(amountMinor, targetCurrency);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: targetCurrency,
    maximumFractionDigits: 2,
  }).format(converted / 100);
}

/**
 * Backwards-compatible 2-arg signature that mirrors the local
 * `formatCurrency(amountMinor, currency)` helpers scattered across the
 * codebase. Kept so existing call sites (`formatCurrency(x, "RON")`) keep
 * returning the exact same string when the default RON/ro-RO pair is used.
 */
export function formatCurrency(
  amountMinor: number,
  currency: CurrencyCode = "RON",
): string {
  return formatMoneyMinor(amountMinor, { targetCurrency: currency });
}

export function convertMinorForDisplay(
  amountMinor: number,
  targetCurrency: CurrencyCode,
): number {
  if (targetCurrency === "EUR") {
    const ron = amountMinor / 100;
    const eur = ron / EXCHANGE_RON_PER_EUR;
    return Math.round(eur * 100);
  }
  return amountMinor;
}

export function localeForLanguage(language: Language): string {
  return LANGUAGE_LOCALE[language];
}