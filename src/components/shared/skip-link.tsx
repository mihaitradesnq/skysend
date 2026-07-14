"use client";

import { useSettings } from "@/lib/settings/settings-context";

/**
 * Client-side because its accessible label follows the active UI language.
 */
export function SkipLink() {
  const { t } = useSettings();

  return (
    <a href="#main-content" className="skip-link">
      {t("a11y.skipToContent")}
    </a>
  );
}
