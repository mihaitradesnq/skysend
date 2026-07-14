"use client";

import { PublicPagePlaceholder } from "@/components/layout/public-page-placeholder";
import { useSettings } from "@/lib/settings/settings-context";
import { getPublicCopy } from "@/lib/i18n/public-copy";

export default function CoverageContent() {
  const { language } = useSettings();
  return <PublicPagePlaceholder content={getPublicCopy(language).coverage} />;
}