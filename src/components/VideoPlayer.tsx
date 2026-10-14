"use client";

import { useEffect, useRef } from "react";

// Plays only while at least half the video is on screen, and never for visitors
// who asked for reduced motion: those keep the poster frame.
//
// The <video> stays mounted with the same src for its whole life. The
// IntersectionObserver only calls play() / pause() and never touches state,
// so React never re-renders and the media pipeline is never torn down: gating
// the src (or swapping the video for an <img> poster) flashed the poster and
// restarted playback from zero on every entry, which was the flicker. Pausing
// off-screen without resetting currentTime resumes seamlessly.
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // entries can be empty: WebKit delivers an empty list when an observer is
        // torn down during a history pop or bfcache restore. Destructuring
        // [entry] straight off it threw a TypeError and took the whole tree down.
        const entry = entries[0];
        if (!entry) return;
        if (entry.intersectionRatio >= 0.5) {
          if (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          )
            return;
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0">
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
    </div>
  );
}
