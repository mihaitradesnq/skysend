import type { LucideIcon } from "lucide-react";

export type AdminSectionKey =
  | "overview"
  | "orders"
  | "parcel-evaluations"
  | "failed-orders"
  | "contact-messages"
  | "statistics"
  | "settings";

export type AdminNavigationItem = {
  key: AdminSectionKey;
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};
