"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollRouteToTop } from "@/components/SmoothScroll";

// Every route starts at the top, including back and forward. Next.js restores
// the previous offset on those, and skips its own scroll-to-top for small
// offsets, so do it by hand and take the browser out of the business. Goes
// through the Lenis instance when smooth scrolling is active so the two never
// fight over the scroll position.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    history.scrollRestoration = "manual";
    scrollRouteToTop();
  }, [pathname]);

  return null;
}