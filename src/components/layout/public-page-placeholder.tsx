import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicPageContent } from "@/constants/public-pages";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { AppButton } from "@/components/shared/app-button";

type PublicPagePlaceholderProps = {
  content: PublicPageContent;
};

export function PublicPagePlaceholder({
  content,
}: PublicPagePlaceholderProps) {
  return (
    <div className="app-section-stack">
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        actions={[
          {
            label: "Începe acum",
            href: "/sign-in",
            variant: "outline",
            icon: <ArrowRight className="size-4" />,
          },
        ]}
      />

      <SectionCard
        eyebrow="SkySend"
        title="Această zonă de serviciu este disponibilă acum."
        description={content.summary}
        footer={
          <div className="flex flex-wrap gap-2">
            <AppButton asChild>
              <Link href="/client/create-delivery">Creează livrare</Link>
            </AppButton>
            <AppButton asChild variant="ghost">
              <Link href="/#coverage">Vezi acoperirea</Link>
            </AppButton>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {content.pillars.map((pillar) => (
            <StatCard
              key={pillar.title}
              label={pillar.title}
              value="Activ"
              hint={pillar.body}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
