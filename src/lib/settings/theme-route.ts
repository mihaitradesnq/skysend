/**
 * Route prefixes that belong to the signed-in application surface. The theme
 * preference (dark/light) is only honoured on these routes; every other route
 * is part of the public marketing site, which is always dark to preserve the
 * brand presentation regardless of the stored preference.
 *
 * Kept as a plain list so the same definition can be embedded into the
 * anti-FOUC script (which runs before React) and reused by the settings
 * context at runtime — one source of truth.
 */
export const APP_ROUTE_PREFIXES = [
  "/client",
  "/admin",
  "/operator",
  "/sign-in",
  "/sign-up",
  "/auth",
  "/sso-callback",
  "/access-denied",
] as const;

/**
 * True when the given pathname belongs to the application surface. Segment-
 * aware so `/admin` matches but a hypothetical `/administration` would not.
 */
export function isAppRoute(pathname: string): boolean {
  return APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Returns the theme that should actually render for a pathname: the stored
 * preference on app routes, always `dark` on the public marketing site.
 */
export function effectiveThemeForPathname(
  pathname: string,
  preference: "dark" | "light",
): "dark" | "light" {
  return isAppRoute(pathname) ? preference : "dark";
}