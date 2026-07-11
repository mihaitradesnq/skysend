import {
  BarChart3,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  Package2,
  Settings,
  TriangleAlert,
} from "lucide-react";
import type { AdminNavigationItem } from "@/types/admin-navigation";

export const adminNavigationItems: readonly AdminNavigationItem[] = [
  {
    key: "overview",
    label: "Privire generală",
    href: "/admin",
    description: "Rezumat operațional și priorități curente.",
    icon: LayoutDashboard,
  },
  {
    key: "orders",
    label: "Comenzi",
    href: "/admin/orders",
    description: "Administrarea comenzilor și detaliilor operaționale.",
    icon: Package2,
  },
  {
    key: "parcel-evaluations",
    label: "Evaluare colete",
    href: "/admin/parcel-evaluations",
    description: "Cereri client pentru profiluri de colet verificate manual.",
    icon: MessageSquareText,
  },
  {
    key: "failed-orders",
    label: "Incidente",
    href: "/admin/failed-orders",
    description: "Cazuri eșuate, motive și pași de rezolvare.",
    icon: TriangleAlert,
  },
  {
    key: "contact-messages",
    label: "Mesaje",
    href: "/admin/contact-messages",
    description: "Mesaje primite din formularul public de contact.",
    icon: Inbox,
  },
  {
    key: "statistics",
    label: "Rapoarte",
    href: "/admin/statistics",
    description: "Indicatori operaționali și export CSV.",
    icon: BarChart3,
  },
  {
    key: "settings",
    label: "Setări",
    href: "/admin/settings",
    description: "Status platformă, rază, tarife și timpi.",
    icon: Settings,
  },
];

export function getAdminNavigationItem(pathname: string) {
  if (pathname.startsWith("/admin/locker-recoveries")) {
    return (
      adminNavigationItems.find((item) => item.key === "failed-orders") ??
      adminNavigationItems[0]
    );
  }

  const exactMatch = adminNavigationItems.find((item) => item.href === pathname);

  if (exactMatch) {
    return exactMatch;
  }

  return (
    adminNavigationItems.find(
      (item) => item.href !== "/admin" && pathname.startsWith(`${item.href}/`),
    ) ?? adminNavigationItems[0]
  );
}
