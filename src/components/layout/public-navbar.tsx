"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { ClerkAuthControls } from "@/components/auth/clerk-auth-controls";
import { publicNavigation } from "@/constants/public-navigation";
import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PublicNavbarProps = {
  overlay?: boolean;
};

export function PublicNavbar({ overlay = false }: PublicNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [openedAtPathname, setOpenedAtPathname] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);

  const opaque = overlay ? scrolled || isOpen : true;
  const transparent = !opaque;

  let navBackground: string;
  let navBorder: string;
  let navBlur: number;
  if (!overlay) {
    navBackground = "rgb(4 10 12 / 0.88)";
    navBorder = "rgb(34 211 238 / 0.7)";
    navBlur = 20;
  } else if (opaque) {
    navBackground = "rgba(5, 7, 10, 0.85)";
    navBorder = "rgba(255, 255, 255, 0.05)";
    navBlur = 12;
  } else {
    navBackground = "rgba(5, 7, 10, 0)";
    navBorder = "rgba(255, 255, 255, 0)";
    navBlur = 0;
  }

  useEffect(() => {
    if (!overlay) return;
    let frame = 0;
    const compute = () => {
      const hero = document.querySelector<HTMLElement>("#main-content section");
      const heroScrollable = hero
        ? hero.offsetHeight - window.innerHeight
        : window.innerHeight * 0.8;

      const threshold =
        heroScrollable > 0 ? heroScrollable * 0.9 : window.innerHeight * 0.8;
      setScrolled(window.scrollY > threshold);
    };
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        compute();
        frame = 0;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [overlay]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  if (isOpen && pathname !== openedAtPathname) {
    setOpenedAtPathname(pathname);
    setIsOpen(false);
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter,color] duration-300 ease-out",
        transparent
          ? "text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]"
          : "text-foreground",
      )}
      style={{
        backgroundColor: navBackground,
        borderColor: navBorder,
        backdropFilter: `blur(${navBlur}px)`,
        WebkitBackdropFilter: `blur(${navBlur}px)`,
      }}
    >
      <div className="app-container">
        {/* Navbar row: 56px mobile, 64px desktop */}
        <div className="flex h-14 min-w-0 items-center justify-between gap-4 lg:h-16 lg:gap-6">
          <Link href="/" aria-label="Acasă SkySend" className="min-w-0 shrink-0">
            <BrandMark compact />
          </Link>

          {/* Desktop nav links */}
          <nav
            aria-label="Navigație principală"
            className="hidden min-w-0 items-center gap-1 lg:flex"
          >
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "public-nav-link rounded-full px-3 py-1.5 text-sm transition-colors duration-300",
                  pathname === item.href
                    ? "bg-secondary/80 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  transparent && "text-white/90 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth controls */}
          <div
            className={cn(
              "hidden shrink-0 items-center gap-2 lg:flex",
              transparent &&
                "[&_[data-variant=ghost]]:text-white/78 [&_[data-variant=ghost]:hover]:bg-white/10 [&_[data-variant=ghost]:hover]:text-white [&_[data-variant=outline]]:border-white/24 [&_[data-variant=outline]]:bg-white/8 [&_[data-variant=outline]]:text-white [&_[data-variant=outline]:hover]:bg-white/14 [&_[data-variant=outline]:hover]:text-white",
            )}
          >
            <ClerkAuthControls />
            <Button
              asChild
              variant="outline"
              size="sm"
              className={cn(
                "transition-colors duration-300",
                transparent &&
                  "border-white/24 bg-white/8 text-white backdrop-blur-md hover:bg-white/14 hover:text-white",
              )}
            >
              <Link href="/client/create-delivery">Aplicație</Link>
            </Button>
          </div>

          {/* Hamburger button — CSS 3-lines → X animation */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn("lg:hidden", transparent && "text-white hover:bg-white/12")}
            aria-expanded={isOpen}
            aria-controls="public-mobile-nav"
            aria-label={
              isOpen ? "Închide meniul de navigație" : "Deschide meniul de navigație"
            }
            onClick={() => setIsOpen((v) => !v)}
          >
            {/* 3 bars that animate to X */}
            <span
              aria-hidden="true"
              className="relative flex size-6 flex-col items-center justify-center gap-[5px]"
            >
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ease-in-out",
                  isOpen && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ease-in-out",
                  isOpen && "scale-x-0 opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ease-in-out",
                  isOpen && "-translate-y-[7px] -rotate-45",
                )}
              />
            </span>
          </Button>
        </div>
      </div>

      {/* Mobile menu — slide-down animation */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            key="mobile-nav"
            id="public-mobile-nav"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-3 top-[calc(100%+0.5rem)] w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-[calc(var(--radius)+0.75rem)] border border-border/80 bg-background/96 p-2 shadow-[var(--elevation-panel)] backdrop-blur-xl lg:hidden"
          >
            <div
              className="flex flex-col gap-2"
              style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))" }}
            >
              {/* Nav links */}
              <nav aria-label="Navigație mobilă" className="grid gap-1">
                {publicNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center rounded-2xl px-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/65 hover:text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Auth footer — visually separated */}
              <div className="grid gap-2 border-t border-border/60 pt-2">
                <ClerkAuthControls mobile onAction={() => setIsOpen(false)} />
                <Button
                  asChild
                  variant="outline"
                  className="h-11 w-full justify-center rounded-2xl"
                >
                  <Link
                    href="/client/create-delivery"
                    onClick={() => setIsOpen(false)}
                  >
                    Aplicație
                  </Link>
                </Button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
