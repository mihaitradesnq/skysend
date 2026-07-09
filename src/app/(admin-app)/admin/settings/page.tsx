import { AdminSettingsView } from "@/components/admin/admin-settings-view";
import { getAdminOperationalSettingsFromDB } from "@/lib/admin-data-server";
import { getAdminOperationalSettings } from "@/lib/admin-settings";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Setări",
  "Setări operaționale simple pentru Panoul Administrator SkySend.",
);

export default async function AdminSettingsPage() {
  const dbSettings = await getAdminOperationalSettingsFromDB();

  const settings = dbSettings ?? getAdminOperationalSettings();

  return <AdminSettingsView initialSettings={settings} />;
}
