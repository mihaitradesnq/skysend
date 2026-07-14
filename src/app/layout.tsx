import type { Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Sora } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/shared/providers";
import { SkipLink } from "@/components/shared/skip-link";
import { defaultMetadata } from "@/lib/metadata";
import { ANTI_FOUC_SCRIPT } from "@/lib/settings/anti-fouc";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

export const metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the anti-FOUC script below mutates the
    // <html> className/lang before React hydrates, which is intentional.
    <html
      lang="ro"
      className={`dark ${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen min-h-svh overflow-x-clip font-sans antialiased">
        {/* Anti-FOUC: apply persisted theme + language before first paint. */}
        <Script id="skysend-anti-fouc" strategy="beforeInteractive">
          {ANTI_FOUC_SCRIPT}
        </Script>
        <Providers>
          <SkipLink />
          {children}
        </Providers>
      </body>
    </html>
  );
}
