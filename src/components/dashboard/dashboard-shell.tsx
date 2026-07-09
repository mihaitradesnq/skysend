"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { DashboardBottomNav } from "@/components/dashboard/dashboard-bottom-nav";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { MissionBackgroundRuntime } from "@/components/delivery/mission-background-runtime";
import { useActiveeRole } from "@/hooks/use-active-role";
import { cn } from "@/lib/utils";
import type { DashboardRole } from "@/types/roles";

export function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role?: DashboardRole;
}) {
  const detectedRole = useActiveeRole();
  const activeRole = role ?? detectedRole ?? "client";
  const isClientWorkspace = activeRole === "client";
  const pathname = usePathname();
  const isCreateDeliveryMap = isClientWorkspace && pathname === "/client/create-delivery";

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-background lg:h-dvh lg:min-h-0 lg:overflow-hidden">
      {isClientWorkspace ? <MissionBackgroundRuntime /> : null}
      <div
        className={cn(
          "grid min-h-screen min-w-0 lg:h-full lg:min-h-0",
          "lg:grid-cols-[19.5rem_minmax(0,1fr)]",
        )}
      >
        <DashboardSidebar role={activeRole} />

        <div
          className={cn(
            "min-w-0 lg:h-dvh lg:min-h-0",
            isCreateDeliveryMap ? "lg:overflow-hidden" : "lg:overflow-y-auto",
            isClientWorkspace && !isCreateDeliveryMap
              ? "pb-bottom-nav md:pb-0"
              : undefined,
          )}
        >
          <main
            id="main-content"
            className={cn(
            "min-w-0",
            isCreateDeliveryMap
                ? "relative h-dvh min-h-dvh overflow-x-hidden overflow-y-auto p-0"
                : "px-4 py-4 sm:px-6 lg:px-8 lg:py-6",
            )}
          >
            <div
              className={cn(
                isCreateDeliveryMap
                  ? "pointer-events-none absolute inset-x-0 top-0 z-50"
                  : undefined,
              )}
            >
              <DashboardTopbar role={activeRole} floating={isCreateDeliveryMap} />
            </div>
            <div className={isCreateDeliveryMap ? "min-h-dvh" : "pt-6"}>
              {/* key={pathname} remounts the route on client-side navigation so
                  each destination re-initialises cleanly. Uses the full `motion`
                  component (features bundled) because the client-app tree has no
                  LazyMotion provider — the previous lazy `m` left navigated pages
                  stuck at opacity 0 (blank until a hard refresh). No exit/mode
                  gating, so the new page renders immediately and fades in. */}
              <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {isClientWorkspace ? (
        <div className="md:hidden">
          <DashboardBottomNav />
        </div>
      ) : null}
    </div>
  );
}
