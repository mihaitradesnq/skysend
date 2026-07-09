

import "server-only";

function req(key: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(
      `[env] Missing required server environment variable: ${key}`,
    );
  }
  return value.trim();
}

function opt(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

export const serverEnv = {

  CLERK_SECRET_KEY: req("CLERK_SECRET_KEY", process.env.CLERK_SECRET_KEY),

  SUPABASE_SERVICE_ROLE_KEY: req(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ),

  STRIPE_SECRET_KEY: req("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY),

  STRIPE_WEBHOOK_SECRET: opt(process.env.STRIPE_WEBHOOK_SECRET, ""),

  MAP_PROVIDER_SECRET_KEY: opt(process.env.MAP_PROVIDER_SECRET_KEY, ""),

  RESEND_API_KEY: opt(process.env.RESEND_API_KEY, ""),

  RESEND_FROM_EMAIL: opt(process.env.RESEND_FROM_EMAIL, "noreply@skysend.ro"),

  OVERPASS_API_URL: opt(
    process.env.OVERPASS_API_URL,
    "https://overpass-api.de/api/interpreter",
  ),

  OPENROUTER_API_KEY: opt(process.env.OPENROUTER_API_KEY, ""),

  OPENROUTER_MODEL: opt(process.env.OPENROUTER_MODEL, ""),

  OPENROUTER_SITE_URL: opt(process.env.OPENROUTER_SITE_URL, ""),

  OPENROUTER_APP_NAME: opt(process.env.OPENROUTER_APP_NAME, ""),

  OPENAI_API_KEY: opt(process.env.OPENAI_API_KEY, ""),
} as const;
