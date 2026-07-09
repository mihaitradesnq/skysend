

import "server-only";

import { auth } from "@clerk/nextjs/server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { ProfilesRepository } from "@/lib/repositories/profiles-repository";
import { adminPanelRoles } from "@/constants/roles";
import type { Profile } from "@/types/profile";
import type { UserRole } from "@/types/roles";

export type AdminAuthSuccess = {
  ok: true;
  clerkUserId: string;
  profile: Profile;
};

export type AdminAuthFailure = {
  ok: false;
  status: 401 | 403 | 404 | 502;
  error: string;
};

export async function requireAdminPanelUser(): Promise<
  AdminAuthSuccess | AdminAuthFailure
> {
  const { userId } = await auth();

  if (!userId) {
    return { ok: false, status: 401, error: "Authentication required." };
  }

  const supabase = createAdminSupabaseClient();
  const profiles = new ProfilesRepository(supabase);
  const profileResult = await profiles.getByClerkUserId(userId);

  if (!profileResult.ok) {
    return { ok: false, status: 502, error: "Profile lookup failed." };
  }

  if (!profileResult.data) {
    return { ok: false, status: 404, error: "Profile not found." };
  }

  if (!isAdminPanelRole(profileResult.data.role)) {
    return { ok: false, status: 403, error: "Admin role required." };
  }

  return {
    ok: true,
    clerkUserId: userId,
    profile: profileResult.data,
  };
}

function isAdminPanelRole(role: UserRole): boolean {
  return (adminPanelRoles as readonly UserRole[]).includes(role);
}
