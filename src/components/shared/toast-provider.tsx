"use client";

import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import {
  dismissToast,
  getToastsSnapshot,
  subscribeToasts,
} from "@/lib/toast-store";
import { cn } from "@/lib/utils";

const toneClassNames = {
  info: "border-primary/35",
  success: "border-success/35",
  warning: "border-warning/35",
  destructive: "border-destructive/35",
} as const;

const progressClassNames = {
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
} as const;

export function ToastProvider() {
  const toasts = useSyncExternalStore(
    subscribeToasts,
    getToastsSnapshot,
    getToastsSnapshot,
  );

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed inset-x-3 top-[calc(0.75rem_+_env(safe-area-inset-top))] z-[90] grid gap-3 sm:bottom-auto sm:left-auto sm:right-5 sm:top-5 sm:w-[23rem]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={cn(
            "overflow-hidden rounded-[calc(var(--radius)+0.5rem)] border bg-card/95 shadow-[var(--elevation-panel)] backdrop-blur-md",
            toneClassNames[toast.tone],
          )}
        >
          <div className="flex items-start gap-3 p-4">
            <span
              className={cn(
                "mt-1 size-2.5 shrink-0 rounded-full",
                progressClassNames[toast.tone],
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{toast.title}</p>
              {toast.message ? (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {toast.message}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Închide notificarea"
              onClick={() => dismissToast(toast.id)}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border/80 bg-secondary/45 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <div className="h-1 bg-secondary">
            <div
              className={cn(
                "h-full origin-left animate-[toast-progress_linear_forwards]",
                progressClassNames[toast.tone],
              )}
              style={{ animationDuration: `${toast.durationMs}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
