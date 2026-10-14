"use client";

import { useEffect, useRef, useState } from "react";

// Plays while on screen, and never for visitors who asked for reduced motion:
// those keep the poster frame.
//
// Desktop flicker was the lazy src gate (now gone: src is set from first
// paint). The remaining flicker is mobile-only and has a different cause: iOS
// Safari ignores preload and will not buffer until play() runs, so the video
// element drops its poster before the first frame is decoded — a black/white
// flash on every entry. The fix is a plain <img> with the same poster,
// absolutely positioned over the video with the same object-cover fit, removed
// only after the video fires "playing" (timeupdate past zero as fallback) for
// the first time. It never comes back, so re-entry cannot flash.
//
// The <video> itself stays mounted with a stable src for its whole life: the
// observer only calls play() / pause() and never touches state, currentTime,
// src, or load(). A rootMargin pre-roll plus a 0.01 threshold starts decoding
// ~200px before the video is visible, so the first frame is usually ready by
// the time it enters. Pausing off-screen without resetting resumes seamlessly.
export default function VideoPlayer({
  src,
  alt,
  poster,
  preload = "metadata",
}: {
  src: string;
  alt: string;
  poster?: string;
  preload?: "auto" | "metadata" | "none";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // False until the first decoded frame is on screen. One-way: once true it
  // never resets, so the overlay can never flash on re-entry.
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // The muted IDL property, not just the attribute: iOS Safari only grants
    // autoplay when the property is set before play() is called. Re-asserted
    // on every entry in the observer below, since anything that re-seats the
    // element could drop it.
    video.muted = true;
    video.defaultMuted = true;

    const markPlayed = () => setHasPlayed(true);
    const onTimeUpdate = () => {
      if (video.currentTime > 0) markPlayed();
    };
    video.addEventListener("playing", markPlayed);
    video.addEventListener("timeupdate", onTimeUpdate);

    const observer = new IntersectionObserver(
      (entries) => {
        // entries can be empty: WebKit delivers an empty list when an observer is
        // torn down during a history pop or bfcache restore. Destructuring
        // [entry] straight off it threw a TypeError and took the whole tree down.
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
          video.muted = true;
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      // Pre-roll decoding before the video is visible (mobile decoders are
      // torn down aggressively off-screen) and a near-zero threshold so
      // playback starts the moment any pixel approaches.
      { threshold: 0.01, rootMargin: "200px 0px" }
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("playing", markPlayed);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  return (
    // Near-black fill matching the posters: never a white flash while the
    // first frame decodes. Parents already fix the aspect ratio (grid cards
    // and gallery frames), so there is no layout shift either.
    <div className="absolute inset-0 bg-[var(--color-surface)]">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={preload}
        aria-label={alt}
        className="h-full w-full object-cover transition-transform duration-[800ms] [transition-timing-function:var(--ease-out-expo)] motion-reduce:transition-none group-hover:scale-[1.02]"
      />
      {/* Plain <img> on purpose: the overlay must paint synchronously with an
          identical object-cover fit and no optimizer wrapper or lazy boundary
          of its own. Removed for good after the first frame plays. */}
      {!hasPlayed && poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
