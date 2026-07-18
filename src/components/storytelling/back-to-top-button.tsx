"use client";

import { ArrowUp } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import styles from "./storytelling.module.css";

export function BackToTopButton({ ariaLabel }: { ariaLabel: string }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <button
      type="button"
      className={styles.backToTopButton}
      aria-label={ariaLabel}
      onClick={() => {
        document.getElementById("story-hero")?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }}
    >
      <ArrowUp aria-hidden="true" />
    </button>
  );
}
