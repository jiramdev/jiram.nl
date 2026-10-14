"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Single Lenis instance owned by <SmoothScroll/>. Module-level so route
// helpers (ScrollToTop, FloatingDock) can drive the same scroller instead of
// fighting it with raw window.scrollTo calls.
let lenis: Lenis | null = null;

/** Instant jump to top on route change. Falls back to native scrolling when
    Lenis is disabled (reduced motion) or not yet mounted. */
export function scrollRouteToTop() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/** Smooth glide to top for in-page affordances (e.g. the dock's Home link
    while already home). Falls back to native smooth scrolling. */
export function scrollSmoothToTop() {
  if (lenis) {
    lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Lenis drives the *native* scroll position via rAF on wheel input: no wrapper
// transforms, so sticky (Header), fixed (FloatingDock) and IntersectionObserver
// (VideoPlayer) all keep working on real scroll offsets. Touch is left native
// (no syncTouch), so mobile scrolling — and the video pre-roll fix — behave
// exactly as before. Created once; fully disabled under prefers-reduced-motion.
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    scrollRouteToTop();
  }, [pathname]);

  return null;
}
