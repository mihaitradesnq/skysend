import type { Viewport } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Manrope, Sora } from "next/font/google";
import { ToastProvider } from "@/components/shared/toast-provider";
import { roleRoutingPaths } from "@/constants/roles";
import { isClerkFrontendConfigured } from "@/lib/clerk-config";
import { clerkAppearance, clerkLocalization } from "@/lib/clerk-theme";
import { defaultMetadata } from "@/lib/metadata";
import { ProfileProvider } from "@/lib/profile-context/profile-context";
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

const clerkEnabled = isClerkFrontendConfigured();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ro" className={`dark ${bodyFont.variable} ${displayFont.variable}`}>
      <body className="min-h-screen min-h-svh overflow-x-clip font-sans antialiased">
        {clerkEnabled ? (
          <ClerkProvider
            appearance={clerkAppearance}
            localization={clerkLocalization}
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            signInFallbackRedirectUrl={roleRoutingPaths.authContinue}
            signUpFallbackRedirectUrl={roleRoutingPaths.authContinue}
          >
            <ProfileProvider>
              <a href="#main-content" className="skip-link">
                Sari la conținutul principal
              </a>
              {children}
              <ToastProvider />
            </ProfileProvider>
          </ClerkProvider>
        ) : (
          <>
            <a href="#main-content" className="skip-link">
              Sari la conținutul principal
            </a>
            {children}
            <ToastProvider />
          </>
        )}
      </body>
    </html>
  );
}
