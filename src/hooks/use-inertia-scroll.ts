"use client";

import { useEffect } from "react";

/**
 * Smooth inertia scroll for the public marketing surface.
 *
 * Listens to `wheel` on the window and, once a scroll gesture settles (no new
 * wheel events for a short quiet window), adds a brief residual glide on top of
 * the native scroll so the page keeps coasting for ~0.5s with eased deceleration
 * — the "feels smooth" effect asked for.
 *
 * Safety rails:
 * - Never calls `preventDefault`, so native scrolling (and any nested
 *   scrollable containers such as dropdowns or side panels) keeps working.
 * - Disabled on coarse pointers (touch already has native momentum) and when
 *   `prefers-reduced-motion` is set.
 * - The glide only touches the window/document scroller, is capped, and is
 *   cancelled the instant a new wheel event arrives so control stays responsive.
 * - No work happens for tiny deltas, so ordinary one-notch scrolls aren't
 *   exaggerated.
 */
export function useInertiaScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarsePointer) return;

    let lastDeltaY = 0;
    let lastEventAt = 0;
    let quietTimer: ReturnType<typeof setTimeout> | null = null;
    let glideFrame = 0;
    // Track whether the last user gesture was a wheel, so the glide only ever
    // rides after a wheel-initiated scroll.
    let wheelActive = false;

    function getScrollTop() {
      return window.scrollY ?? document.documentElement.scrollTop ?? 0;
    }

    function getMaxScrollTop() {
      const docEl = document.documentElement;
      return Math.max(0, docEl.scrollHeight - docEl.clientHeight);
    }

    function cancelGlide() {
      if (glideFrame) {
        window.cancelAnimationFrame(glideFrame);
        glideFrame = 0;
      }
    }

    function startGlide() {
      cancelGlide();

      // Distance for the residual glide, derived from the last wheel impulse
      // and clamped so it never overshoots dramatically.
      const impulse = Math.abs(lastDeltaY);
      if (impulse < 8) return;

      const direction = lastDeltaY > 0 ? 1 : -1;
      const glideDistance = Math.min(impulse * 2.2, 220) * direction;
      const startTop = getScrollTop();
      const targetTop = Math.min(
        Math.max(startTop + glideDistance, 0),
        getMaxScrollTop(),
      );
      if (targetTop === startTop) return;

      const duration = 460; // ~0.5s coast, in ms
      const startTime = performance.now();

      function tick(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const nextTop = startTop + (targetTop - startTop) * eased;
        window.scrollTo({ top: nextTop, behavior: "auto" });

        if (progress < 1 && wheelActive === false) {
          glideFrame = window.requestAnimationFrame(tick);
        } else {
          glideFrame = 0;
        }
      }

      wheelActive = false;
      glideFrame = window.requestAnimationFrame(tick);
    }

    function handleWheel(event: WheelEvent) {
      wheelActive = true;
      cancelGlide();
      lastDeltaY = event.deltaY;
      lastEventAt = Date.now();

      if (quietTimer) clearTimeout(quietTimer);
      quietTimer = setTimeout(() => {
        quietTimer = null;
        // Only coast if the page itself was scrolling (i.e. the wheel wasn't
        // consumed by an inner element reaching its scroll bounds), which we
        // approximate by checking that the document scroller can still move in
        // the gesture direction — avoids fighting nested scrollers.
        const top = getScrollTop();
        const max = getMaxScrollTop();
        const canMove =
          lastDeltaY > 0 ? top < max : top > 0;
        if (canMove) startGlide();
      }, 90);
    }

    function cancelUser() {
      // Any non-wheel interaction hands control back to the user.
      cancelGlide();
      wheelActive = true;
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("pointerdown", cancelUser, { passive: true });
    window.addEventListener("keydown", cancelUser, { passive: true });
    window.addEventListener("touchstart", cancelUser, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointerdown", cancelUser);
      window.removeEventListener("keydown", cancelUser);
      window.removeEventListener("touchstart", cancelUser);
      if (quietTimer) clearTimeout(quietTimer);
      cancelGlide();
    };
  }, []);
}