import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "motion/react";
import NavigationHeader from "@/components/NavigationHeader";
import FlyingLoader from "@/components/FlyingLoader";
import FloatingDock from "@/components/FloatingDock";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import { LoaderProvider } from "@/components/PageLoaderContext";
import { INTRO_BOOTSTRAP } from "@/lib/intro";
import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  SITE_DESCRIPTION,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const sansFont = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#faf9f5",
  width: "device-width",
  initialScale: 1,
};

// Icons come from src/app/icon.svg + src/app/apple-icon.png, share images from
// opengraph-image.tsx. Do not add `icons` or `images` here or they win.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jiram — Frontend Developer & UI/UX Designer",
    template: "%s | Jiram",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Jiram",
  keywords: [
    "jiram",
    "frontend developer",
    "UI/UX designer",
    "design systems",
    "web development",
    "Netherlands",
  ],
  authors: [{ name: "Jiram", url: siteUrl }],
  creator: "Jiram",
  publisher: "Jiram",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jiram",
    title: "Jiram — Frontend Developer & UI/UX Designer",
    description: SITE_DESCRIPTION,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jiram — Frontend Developer & UI/UX Designer",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Jiram",
        jobTitle: "Frontend Developer & UI/UX Designer",
        url: siteUrl,
        email: EMAIL,
        sameAs: [GITHUB_URL, LINKEDIN_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Jiram",
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  };

  return (
    <html lang="en" className={sansFont.variable}>
      <body className="antialiased bg-[var(--color-background)] text-[var(--color-text)]">
        {/* Decides play/skip before the intro curtain is painted. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LoaderProvider>
          <MotionConfig reducedMotion="user">
            <SmoothScroll />
            <ScrollToTop />
            <NavigationHeader />
            <main>{children}</main>
            <FlyingLoader />
            <FloatingDock />
          </MotionConfig>
        </LoaderProvider>
      </body>
    </html>
  );
}