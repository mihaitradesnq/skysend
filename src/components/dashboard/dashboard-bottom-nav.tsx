"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPinned, Package, Plus, User } from "lucide-react";
import { motion } from "motion/react";
import { useNotificări } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/client/create-delivery", icon: Plus, label: "Creează", accent: true, badge: false },
  { href: "/client/orders", icon: Package, label: "Comenzi", accent: false, badge: false },
  { href: "/client/saved-places", icon: MapPinned, label: "Salvate", accent: false, badge: false },
  { href: "/client/settings", icon: User, label: "Cont", accent: false, badge: false },
] as const;

export function DashboardBottomNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotificări();

  return (
    <nav
      aria-label="Navigație mobilă"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/98 shadow-[0_-12px_32px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid h-16 grid-cols-4 px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href.length > 1 && pathname.startsWith(item.href + "/"));
          const hasUnread = item.badge && unreadCount > 0;

          return (
            <motion.div
              key={item.href}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={
                  hasUnread
                    ? `${item.label} (${unreadCount} necitite)`
                    : item.label
                }
                className="touch-target relative flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
              >
                {item.accent ? (
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary shadow-[0_4px_14px_-4px_rgba(32,231,213,0.5)]">
                    <Icon className="size-[1.1rem] text-primary-foreground" />
                  </span>
                ) : (
                  <>
                    <span className="relative flex size-8 items-center justify-center">
                      <Icon
                        className={cn(
                          "size-[1.12rem] transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      {hasUnread && (
                        <span
                          aria-hidden="true"
                          className="absolute right-0.5 top-0.5 size-2 rounded-full bg-destructive ring-1 ring-background"
                        />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[0.65rem] font-medium leading-none transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
