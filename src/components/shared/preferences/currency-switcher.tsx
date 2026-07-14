"use client";

import { useSettings } from "@/lib/settings/settings-context";
import type { CurrencyCode } from "@/types/entities";
import { cn } from "@/lib/utils";

const CURRENCY_OPTIONS: ReadonlyArray<{
  value: CurrencyCode;
  symbol: string;
  labelKey: "preferences.currency.RON" | "preferences.currency.EUR";
}> = [
  { value: "RON", symbol: "lei", labelKey: "preferences.currency.RON" },
  { value: "EUR", symbol: "€", labelKey: "preferences.currency.EUR" },
];

export function CurrencySwitcher({
  variant = "inline",
}: {
  variant?: "inline" | "stacked";
}) {
  const { currency, setCurrency, t } = useSettings();

  return (
    <div
      role="group"
      aria-label={t("preferences.currency")}
      className={cn(
        "grid gap-1",
        variant === "stacked" ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      {CURRENCY_OPTIONS.map((option) => {
        const isActive = currency === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => setCurrency(option.value)}
            className={cn(
              "flex items-center gap-2.5 rounded-2xl border px-3 py-2 text-sm font-medium transition-colors duration-200",
              isActive
                ? "border-primary/55 bg-primary/10 text-foreground"
                : "border-border/70 bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            <span className="grid size-5 place-items-center rounded-md bg-primary/15 font-heading text-xs font-semibold text-primary">
              {option.symbol}
            </span>
            <span className="min-w-0 flex-1">{t(option.labelKey)}</span>
            {isActive ? (
              <span
                className="size-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}