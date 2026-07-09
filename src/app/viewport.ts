import type { Viewport } from "next";
import { siteConfig } from "@/constants/site";

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor },
    { media: "(prefers-color-scheme: dark)", color: "#101a29" },
  ],
};
