import Link from "next/link";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { CoverageMapPreview } from "@/components/maps/coverage-map-preview";
import { PublicSection } from "@/components/layout/public-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Livrare cu drona în Pitești",
  "SkySend creează, validează și urmărește livrări cu drona în zona activă Pitești.",
);

const steps = [
  {
    title: "Setează traseul",
    body: "Alege punctul de ridicare și punctul de livrare în Pitești.",
  },
  {
    title: "Confirmă coletul",
    body: "Adaugă mărimea, detaliile de manipulare și plata.",
  },
  {
    title: "Urmărește predarea",
    body: "Urmărește ETA-ul, starea dronei și instrucțiunile compartimentului.",
  },
] as const;

const faqPreview = [
  {
    question: "Unde funcționează SkySend?",
    answer: "În prezent, SkySend funcționează în zona activă Pitești.",
  },
  {
    question: "Ce poate bloca o comandă?",
    answer: "Ridicarea și livrarea trebuie să treacă verificarea de acoperire.",
  },
  {
    question: "Cine poate urmări livrarea?",
    answer:
      "Clientul vede comanda completă, iar destinatarul primește un link de urmărire dedicat.",
  },
] as const;

export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="bg-background">
        <div className="app-container app-page-spacing grid gap-16 md:gap-20">
          <MotionReveal preset="section" margin="-100px">
            <PublicSection
              id="how-it-works"
              eyebrow="Cum funcționează"
              title="Trei pași de la cerere la predare."
              description="SkySend păstrează fluxul simplu: creezi un traseu valid, pregătești coletul și urmărești drona până la finalizarea livrării."
            >
              <div className="grid gap-4 md:grid-cols-3">
                {steps.map((step) => (
                  <MotionReveal
                    key={step.title}
                    preset="section"
                    margin="-80px"
                    className="card-interactive rounded-[var(--ui-radius-card)] border border-border/80 bg-card p-5"
                  >
                    <h3 className="font-heading text-xl tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {step.body}
                    </p>
                  </MotionReveal>
                ))}
              </div>
            </PublicSection>
          </MotionReveal>

          <MotionReveal preset="section" margin="-100px">
            <PublicSection
              id="coverage"
              eyebrow="Acoperire"
              title="Activ doar în Pitești."
              description="Fluxul de livrare verifică ambele puncte ale traseului în zona activă a orașului înainte de lansare."
            >
              <CoverageMapPreview />
            </PublicSection>
          </MotionReveal>

          <MotionReveal preset="section" margin="-100px">
            <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]">
              <Card className="rounded-[var(--ui-radius-panel)] shadow-[var(--elevation-panel)]">
                <CardContent className="grid gap-6 p-6 md:p-8">
                  <div className="space-y-3">
                    <h2 className="type-h2">
                      Creează o livrare în zona activă.
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                      Dacă ambele puncte sunt în acoperirea Pitești, fluxul te
                      ghidează prin colet, plată și urmărire live.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg">
                      <Link href="/client/create-delivery">
                        Creează livrare
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/how-it-works">Cum funcționează</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-[var(--ui-radius-panel)] border border-border/80 bg-card p-6">
                <HelpCircle className="size-5 text-primary" />
                <h2 className="mt-4 font-heading text-2xl tracking-tight">
                  Răspunsuri rapide
                </h2>
                <div className="mt-5 grid gap-4">
                  {faqPreview.map((item) => (
                    <div key={item.question} className="grid gap-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CheckCircle2 className="size-4 text-primary" />
                        {item.question}
                      </p>
                      <p className="pl-6 text-sm leading-6 text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-6">
                  <Link href="/contact">Contact SkySend</Link>
                </Button>
              </div>
            </section>
          </MotionReveal>
        </div>
      </div>
    </>
  );
}
