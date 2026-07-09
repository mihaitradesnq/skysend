import { AdminContactMessagesView } from "@/components/admin/admin-contact-messages-view";
import { getAdminContactMessageDetailsFromDB } from "@/lib/admin-data-server";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Mesaje",
  "Mesaje primite din formularul public și note interne.",
);

export default async function AdminContactMessagesPage() {
  const messages = await getAdminContactMessageDetailsFromDB();

  return <AdminContactMessagesView initialMessages={messages} />;
}
