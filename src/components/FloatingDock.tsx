"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { EMAIL } from "@/lib/site";
import { scrollSmoothToTop } from "@/components/SmoothScroll";
import { useLoader } from "@/components/PageLoaderContext";
import { EASE } from "@/lib/motion";

// Shared by the chip's enter and exit so the dock reads the same speed in both
// directions. easeInOut, not EASE: an ease-out front-loads the movement and
// then crawls, which suits a transform but not a width.
const CHIP_TRANSITION = { duration: 0.26, ease: "easeInOut" } as const;

export default function FloatingDock() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProjectPage = pathname.startsWith("/projects/");
  const { isIntroActive } = useLoader();

  const itemClass =
    "flex min-h-[44px] items-center gap-[8px] rounded-full px-[16px] text-[15px] leading-[1.4] tracking-[-0.01em] transition-colors duration-[200ms] [transition-timing-function:var(--ease-out-expo)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2 motion-reduce:transition-none";

  return (
    <aside
      aria-label="Floating Navigation"
      className="pointer-events-none fixed inset-x-0 bottom-[22px] z-50 flex justify-center px-[16px] pb-[env(safe-area-inset-bottom)]"
    >
      <motion.nav
        initial={false}
        animate={{ opacity: isIntroActive ? 0 : 1 }}
        transition={{ duration: 0.52, ease: EASE }}
        className="pointer-events-auto flex items-center gap-[4px] rounded-full border border-[#141413] bg-[#141413] p-[4px] text-[#ffffff] shadow-[rgba(0,0,0,0.01)_0px_2px_2px_0px,rgba(0,0,0,0.02)_0px_4px_4px_0px,rgba(0,0,0,0.04)_0px_16px_24px_0px]"
      >
        <Link
          href="/"
          aria-current={isHome ? "page" : undefined}
          onClick={(event) => {
            // Already home: not a navigation, so scroll up by hand.
            if (!isHome) return;
            event.preventDefault();
            scrollSmoothToTop();
          }}
          className={`${itemClass} ${
            isHome
              ? "bg-[#faf9f5] font-[700] text-[#141413]"
              : "font-[400] text-[#ffffff]/80 hover:bg-[#ffffff]/10 hover:text-[#ffffff]"
          }`}
        >
          <svg
            className="h-[14px] w-[14px] shrink-0 stroke-current"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </Link>

        <a
          href={`mailto:${EMAIL}`}
          className={`${itemClass} font-[400] text-[#ffffff]/80 hover:bg-[#ffffff]/10 hover:text-[#ffffff]`}
        >
          <svg
            className="h-[14px] w-[14px] shrink-0 stroke-current"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>Contact</span>
        </a>

        {/* AnimatePresence so the chip collapses on the way back to home too:
            without it the conditional unmount was an instant pop.

            Width only, and the padding lives on the inner div. Animating padding
            alongside width breaks `width: "auto"`: motion measures the target
            before the padding has grown, lands on the content width, and the box
            snaps wider at the end. Padding here would also floor width:0 at its
            own 29px. Moving both onto the inner div lets the outer box go to a
            true 0 while overflow-hidden clips the content.

            Both directions share CHIP_TRANSITION. EASE is an ease-out, which
            suits a transform but on width dumps 80% of the travel into the
            first 30ms and then creeps through the last 30px for over 200ms.
            That tail is the visible stutter, and it also made the chip feel
            like it snapped into place going one way and glided the other, so
            ease-in-out now runs both directions at the same speed. */}
        <AnimatePresence>
          {isProjectPage && (
            <motion.div
              key="viewing-project"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={CHIP_TRANSITION}
              // hidden below sm, so the chip is gone on a 390px screen: with it the
              // dock measured 373px, 96% of the viewport. The mobile header already
              // names the project, so the chip is redundant there. Hidden in CSS
              // rather than a JS media query, or it would flash on hydration. Above
              // sm the chip costs 151px of a 640px screen, which is fine.
              className="hidden overflow-hidden sm:block"
            >
              <div className="flex min-h-[44px] items-center gap-[8px] border-l border-[#ffffff]/15 pl-[12px] pr-[16px] text-[15px] leading-[1.4] tracking-[-0.01em] text-[#ffffff]/60 select-none">
                <span
                  className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#faf9f5]"
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap">Viewing Project</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </aside>
  );
}