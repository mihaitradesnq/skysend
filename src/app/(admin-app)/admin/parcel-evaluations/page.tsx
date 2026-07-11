import { AdminParcelEvaluationsView } from "@/components/admin/admin-parcel-evaluations-view";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Evaluare colete",
  "Cererile de evaluare operator pentru profilurile de colet din fluxul de creare livrare.",
);

export default function AdminParcelEvaluationsPage() {
  return <AdminParcelEvaluationsView />;
}
