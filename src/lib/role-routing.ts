import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getDemoAdminRoleFromEmail,
  getPostAuthRedirectPath,
  getRoleFromClerkMetadata,
  resolveUserRole,
} from "@/lib/auth";
import type { ClerkRoleMetadata } from "@/types/roles";

export async function resolveRoleRedirectPath() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const user = await currentUser();
  const primaryEmail =
    user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    )?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null;
  const clerkRole = getRoleFromClerkMetadata(
    (user?.publicMetadata ?? null) as ClerkRoleMetadata | null,
    (user?.privateMetadata ?? null) as ClerkRoleMetadata | null,
  );
  const demoEmailRole = getDemoAdminRoleFromEmail(primaryEmail);

  const resolution = resolveUserRole({
    clerkRole,
    fallbackRole: demoEmailRole ?? undefined,
  });

  return getPostAuthRedirectPath(resolution.role);
}
