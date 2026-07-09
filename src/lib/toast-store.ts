import type { SkySendToast, SkySendToastInput } from "@/types/notifications";
import { arePopupNotificăriEnabled } from "@/lib/notification-preferences";

type ToastListener = (toasts: SkySendToast[]) => void;

const maxVisibleToasts = 3;
const listeners = new Set<ToastListener>();
let toasts: SkySendToast[] = [];

function createToastId() {
  const entropy =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `toast_${Date.now().toString(36)}_${entropy}`;
}

function notifyListeners() {
  listeners.forEach((listener) => listener(toasts));
}

export function subscribeToasts(listener: ToastListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getToastsSnapshot() {
  return toasts;
}

export function dismissToast(toastId: string) {
  toasts = toasts.filter((toast) => toast.id !== toastId);
  notifyListeners();
}

export function showToast(input: SkySendToastInput) {
  const isCritical =
    input.importance === "critical" || input.tone === "destructive";

  if (!isCritical && !arePopupNotificăriEnabled()) {
    return null;
  }

  const toast: SkySendToast = {
    id: createToastId(),
    title: input.title,
    message: input.message,
    tone: input.tone ?? "info",
    durationMs: input.durationMs ?? 3800,
    createdAt: Date.now(),
  };

  toasts = [toast, ...toasts].slice(0, maxVisibleToasts);
  notifyListeners();

  if (typeof window !== "undefined") {
    window.setTimeout(() => dismissToast(toast.id), toast.durationMs);
  }

  return toast;
}
