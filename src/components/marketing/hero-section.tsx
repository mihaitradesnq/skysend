"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

const DESKTOP_FRAME_COUNT = 150;
const MOBILE_FRAME_COUNT = 90;
const SECTION_HEIGHT = 9300;
const EAGER_COUNT = 15;
const PROGRESSIVE_INTERVAL_MS = 30;
const READY_FRAMES = 5;
const FRAME_SCROLL_FRACTION = 0.9;
const WASH_MAX_OPACITY = 0.22;
const SLOW_FRAME_MS = 50;
const SLOW_FRAME_RUN = 5;

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FALLBACK_VIDEO = "/assets/hero-scroll/mobile-fallback.mp4";

const framePath = (isMobile: boolean, index: number): string => {
  const set = isMobile ? "mobile" : "desktop";
  return `/assets/hero-scroll/${set}/${set}_${String(index).padStart(3, "0")}.webp`;
};

const DESKTOP_FIRST = framePath(false, 1);
const MOBILE_FIRST = framePath(true, 1);

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cyanWashRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef = useRef<HTMLDivElement>(null);
  const exitCoverRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const [perfFallback, setPerfFallback] = useState(false);

  useEffect(() => {

    if (perfFallback) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = prefersReducedMotion;
    const totalFrames = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;

    const staticFrame = Math.max(1, Math.round(totalFrames / 2));
    const eagerTarget = reduced ? 1 : Math.min(EAGER_COUNT, totalFrames);
    const readyNeed = reduced ? 1 : Math.min(READY_FRAMES, totalFrames);

    const images = new Map<number, HTMLImageElement>();
    const loaded = new Set<number>();

    let cancelled = false;
    let progressiveTimer: number | null = null;
    let resizeTimer: number | null = null;
    let scrollRafId: number | null = null;
    let idleHandle: number | null = null;
    let progressiveStarted = false;
    let eagerSettled = 0;
    let revealed = false;

    let cssW = 1;
    let cssH = 1;
    let desiredFrame = reduced ? staticFrame : 1;
    let lastDrawn = 0;

    let lastScrubTs = 0;
    let slowRun = 0;
    let rafScheduled = false;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawn = 0;
    };

    const bestAvailable = (index: number): number => {
      if (loaded.has(index)) return index;
      for (let i = index - 1; i >= 1; i--) if (loaded.has(i)) return i;
      for (let i = index + 1; i <= totalFrames; i++) if (loaded.has(i)) return i;
      return 0;
    };

    const draw = (index: number) => {
      const drawIdx = bestAvailable(index);
      if (!drawIdx || drawIdx === lastDrawn) return;
      const img = images.get(drawIdx);
      if (!img || !img.naturalWidth) return;

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cssW / cssH;
      let drawW: number;
      let drawH: number;
      let offsetX: number;
      let offsetY: number;
      if (imgRatio > canvasRatio) {
        drawH = cssH;
        drawW = drawH * imgRatio;
        offsetX = (cssW - drawW) / 2;
        offsetY = 0;
      } else {
        drawW = cssW;
        drawH = drawW / imgRatio;
        offsetX = 0;
        offsetY = (cssH - drawH) / 2;
      }
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      lastDrawn = drawIdx;
    };

    const reveal = () => {
      if (revealed || cancelled) return;
      revealed = true;
      canvas.style.opacity = "1";
      const loading = loadingRef.current;
      if (loading) {
        loading.style.opacity = "0";
        window.setTimeout(() => {
          if (!cancelled && loadingRef.current) {
            loadingRef.current.style.display = "none";
          }
        }, 400);
      }
    };

    const onSettled = (index: number, isEager: boolean) => {
      if (cancelled) return;
      if (isEager) {
        eagerSettled += 1;
        if (!reduced && eagerSettled >= eagerTarget) startProgressive();
      }
      if (loaded.size >= readyNeed) reveal();

      if (loaded.has(index) && index <= desiredFrame) draw(desiredFrame);
    };

    const loadFrame = (index: number, isEager: boolean) => {
      if (index < 1 || index > totalFrames || images.has(index)) return;
      const img = new Image();
      img.decoding = "async";

      if (index !== 1) img.fetchPriority = "low";
      images.set(index, img);
      img.onload = () => {
        if (cancelled) return;
        loaded.add(index);
        onSettled(index, isEager);
      };
      img.onerror = () => onSettled(index, isEager);
      img.src = framePath(isMobile, index);
    };

    function startProgressive() {
      if (progressiveStarted) return;
      progressiveStarted = true;
      let next = eagerTarget + 1;
      const step = () => {
        if (cancelled || next > totalFrames) return;
        loadFrame(next, false);
        next += 1;
        progressiveTimer = window.setTimeout(step, PROGRESSIVE_INTERVAL_MS);
      };
      progressiveTimer = window.setTimeout(step, PROGRESSIVE_INTERVAL_MS);
    }

    const updateFromScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const scrollable = section.offsetHeight - window.innerHeight;
      let progress = scrollable > 0 ? scrolled / scrollable : 0;
      progress = clamp01(progress);

      const frameProgress = Math.min(progress / FRAME_SCROLL_FRACTION, 1);
      desiredFrame = Math.round(frameProgress * (totalFrames - 1)) + 1;

      const washProgress = clamp01(
        (progress - FRAME_SCROLL_FRACTION) / (1 - FRAME_SCROLL_FRACTION),
      );
      if (cyanWashRef.current) {
        cyanWashRef.current.style.opacity = String(washProgress * WASH_MAX_OPACITY);
      }

      const vignetteProgress = clamp01((progress - 0.58) / 0.26);
      if (vignetteRef.current) {
        vignetteRef.current.style.opacity = String(vignetteProgress);
      }

      const copyFadeProgress = clamp01((progress - 0.72) / 0.18);
      if (heroCopyRef.current) {
        heroCopyRef.current.style.opacity = String(1 - copyFadeProgress);
        heroCopyRef.current.style.transform = `translateY(${copyFadeProgress * 18}px)`;
      }

      const fadeProgress = clamp01((progress - 0.54) / 0.34);
      if (bottomFadeRef.current) {
        bottomFadeRef.current.style.opacity = String(fadeProgress);
      }

      const exitCoverProgress = clamp01((progress - 0.9) / 0.1);
      if (exitCoverRef.current) {
        exitCoverRef.current.style.opacity = String(exitCoverProgress);
      }

      if (progressTrackRef.current) {
        const progressCueFade = 1 - clamp01((progress - 0.78) / 0.12);
        progressTrackRef.current.style.opacity = String(progressCueFade);
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleY(${progress})`;
      }
    };

    const measureFps = (ts: number) => {
      if (lastScrubTs) {
        const delta = ts - lastScrubTs;
        if (delta < 200) {
          if (delta > SLOW_FRAME_MS) {
            slowRun += 1;
            if (slowRun >= SLOW_FRAME_RUN) {
              console.warn("Hero performance fallback engaged");
              setPerfFallback(true);
              return;
            }
          } else {
            slowRun = 0;
          }
        } else {
          slowRun = 0;
        }
      }
      lastScrubTs = ts;
    };

    const onScroll = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      scrollRafId = requestAnimationFrame((ts) => {
        rafScheduled = false;
        scrollRafId = null;
        updateFromScroll();
        draw(desiredFrame);
        measureFps(ts);
      });
    };

    const onResize = () => {
      if (resizeTimer != null) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        sizeCanvas();
        if (!reduced) updateFromScroll();
        draw(desiredFrame);
      }, 150);
    };

    sizeCanvas();
    window.addEventListener("resize", onResize, { passive: true });

    if (reduced) {

      loadFrame(staticFrame, true);
    } else {
      desiredFrame = 1;
      updateFromScroll();

      loadFrame(1, true);
      const loadEagerRest = () => {
        if (cancelled) return;
        for (let i = 2; i <= eagerTarget; i++) loadFrame(i, true);
      };
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(loadEagerRest, { timeout: 2000 });
      } else {
        idleHandle = window.setTimeout(loadEagerRest, 200);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (scrollRafId != null) cancelAnimationFrame(scrollRafId);
      if (progressiveTimer != null) clearTimeout(progressiveTimer);
      if (resizeTimer != null) clearTimeout(resizeTimer);
      if (idleHandle != null) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleHandle);
        }
        clearTimeout(idleHandle);
      }
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      });
      images.clear();
      loaded.clear();
    };
  }, [isMobile, prefersReducedMotion, perfFallback]);

  const staticMode = prefersReducedMotion || perfFallback;

  return (
    <>
      {/* Viewport-aware LCP preload of frame 1. React hoists these into <head>;
          the media attribute ensures only one set is fetched. */}
      <link
        rel="preload"
        as="image"
        href={DESKTOP_FIRST}
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={MOBILE_FIRST}
        media="(max-width: 767px)"
        fetchPriority="high"
      />

      <section
        ref={sectionRef}
        aria-label="SkySend — livrare cu drona în Pitești"
        style={{
          position: "relative",
          height: staticMode ? "100dvh" : `${SECTION_HEIGHT}px`,
        }}
      >
        {/* Layer 1: sticky stage */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100dvh",
            width: "100%",
            overflow: "hidden",
            background: "#05070a",
          }}
        >
          {perfFallback ? (
            <video
              src={FALLBACK_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "block",
                opacity: 0,
                transition: "opacity 400ms ease",
              }}
            />
          )}

          {/* Cyan wash overlay (last 10% of scroll, JS-driven opacity) */}
          {!staticMode && (
            <div
              ref={cyanWashRef}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 50% 82%, rgba(32,231,213,0.18) 0%, transparent 62%)",
                opacity: 0,
                pointerEvents: "none",
                transition: "opacity 200ms ease-out",
                zIndex: 2,
              }}
            />
          )}

          {/* Cinematic transition layers — vignette, bottom fade, and a final
              background-color cover. All are JS-driven by scroll progress. */}
          {!staticMode && (
            <>
              <div ref={vignetteRef} className="hero-vignette" aria-hidden="true" />
              <div ref={bottomFadeRef} className="hero-bottom-fade" aria-hidden="true" />
              <div ref={exitCoverRef} className="hero-exit-cover" aria-hidden="true" />
            </>
          )}

          {/* Readability gradient behind the copy */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "linear-gradient(to top, rgba(5,7,10,0.85) 0%, rgba(5,7,10,0.2) 50%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Static text overlay — raised so it clears the scan line. */}
          <div
            ref={heroCopyRef}
            style={{
              position: "absolute",
              left: "5%",
              right: "5%",
              bottom: isMobile ? "40%" : "35%",
              maxWidth: 720,
              pointerEvents: "none",
              zIndex: 4,
              transform: "translateY(0)",
              transition: "opacity 160ms ease-out, transform 160ms ease-out",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading, sans-serif)",
                fontSize: "clamp(28px, 5vw, 56px)",
                fontWeight: 600,
                color: "white",
                margin: "0 0 12px",
                lineHeight: 1.1,
                textShadow: "0 2px 24px rgba(0,0,0,0.6)",
              }}
            >
              Trimite colete cu drona,
              <br />
              în Pitești
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans, sans-serif)",
                fontSize: "clamp(14px, 1.8vw, 18px)",
                color: "rgba(255,255,255,0.92)",
                margin: 0,
                lineHeight: 1.5,
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              Securizat. Rapid. Poți urmări de oriunde.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 28,
                pointerEvents: "auto",
              }}
            >
              <Link
                href="/client/create-delivery"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  background: "var(--color-primary, #20e7d5)",
                  color: "#05070a",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 16,
                  textDecoration: "none",
                }}
              >
                Creează livrare →
              </Link>
              <Link
                href="/coverage"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  background: "transparent",
                  color: "white",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 16,
                  textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.4)",
                }}
              >
                Verifică zona
              </Link>
            </div>
          </div>

          {/* Progress bar (right side, drains top → bottom on scroll) */}
          {!staticMode && (
            <div
              ref={progressTrackRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 24,
                top: "50%",
                transform: "translateY(-50%)",
                width: 3,
                height: 180,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                overflow: "hidden",
                zIndex: 5,
                transition: "opacity 160ms ease-out",
              }}
            >
              <div
                ref={progressBarRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "#ffffff",
                  borderRadius: 2,
                  transformOrigin: "top",
                  transform: "scaleY(0)",
                }}
              />
            </div>
          )}

          {/* Loading indicator — fades out once the first frames are ready */}
          {!perfFallback && (
            <div
              ref={loadingRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#05070a",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "var(--font-sans, sans-serif)",
                fontSize: 14,
                letterSpacing: "0.04em",
                opacity: 1,
                transition: "opacity 400ms ease",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              <span style={{ animation: "heroPulse 1.4s ease-in-out infinite" }}>
                Se încarcă experiența...
              </span>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }

        /* Vignette: radial dark mask over the edges, focus on the centre. */
        .hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 70% 60% at 50% 45%,
            transparent 35%,
            rgba(5, 7, 10, 0.35) 75%,
            rgba(5, 7, 10, 0.65) 100%
          );
          pointer-events: none;
          opacity: 0;
          transition: opacity 200ms ease-out;
          z-index: 3;
        }

        /* Bottom fade — gradient that melts the hero into the next section. */
        .hero-bottom-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 68%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            color-mix(in srgb, var(--background) 8%, transparent) 22%,
            color-mix(in srgb, var(--background) 55%, transparent) 58%,
            var(--background) 100%
          );
          pointer-events: none;
          opacity: 0;
          z-index: 3;
        }

        .hero-exit-cover {
          position: absolute;
          inset: 0;
          background: var(--background);
          pointer-events: none;
          opacity: 0;
          z-index: 6;
        }

      `}</style>
    </>
  );
}
