import Link from "next/link";
import { ArrowRight, CalendarClock, Gauge, Zap } from "lucide-react";
import { PublicSection } from "@/components/layout/public-section";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Tarife",
  "Vezi modelul curent de tarifare pentru livrări standard, prioritare și programate cu drona în Pitești.",
);

const pricingPlans = [
  {
    name: "Standard",
    description:
      "Pentru cereri normale în aceeași zi în zona activă Pitești, cu un interval echilibrat și tarifare clară.",
    eta: "25-40 min",
    pricing: "Începe de la 24 RON, apoi se ajustează ușor în funcșie de distanță și manipularea coletului.",
    icon: Gauge,
    highlight: "Potrivită pentru livrări urbane obișnuite.",
  },
  {
    name: "Prioritară",
    description:
      "Pentru lansare mai rapidă când comanda trebuie să intre mai devreme în coadă și să ajungă la livrare mai repede.",
    eta: "12-25 min",
    pricing: "Începe de la 36 RON, cu o componentă de urgență mai mare și ajustare după disponibilitate.",
    icon: Zap,
    highlight: "Potrivită pentru articole medicale, de birou sau sensibile la timp.",
  },
  {
    name: "Programată",
    description:
      "Pentru livrări planificate, când ridicarea și livrarea sunt cunoscute și intervalul poate fi rezervat.",
    eta: "Interval ales",
    pricing: "Începe de la 22 RON, apoi se ajustează după distanță și profilul coletului în intervalul rezervat.",
    icon: CalendarClock,
    highlight: "Potrivită pentru livrări previzibile zilnice sau în următorul interval.",
  },
] as const;

const pricingFactors = [
  {
    title: "Distanță",
    body: "Traseele mai lungi în zona activă Pitești pot creăte suma finală peste prețul de bază.",
  },
  {
    title: "Tip colet",
    body: "Ambalajul, mărimea și manipularea pot modifica estimarea când comanda cere altă clasă de drone sau transport mai atent.",
  },
  {
    title: "Urgență",
    body: "Cererile prioritare includ o componentă de urgență mai mare, deoarece pot intra mai devreme în coada de lansare.",
  },
  {
    title: "Disponibilitate operațională",
    body: "Starea live a flotei și capacitatea coridoarelor active pot influența estimarea finală la confirmare.",
  },
] as const;

const pricingSignals = [
  {
    label: "Oraș activ",
    value: "Pitești",
    hint: "Tarifele se aplică momentan doar în zona activă Pitești.",
  },
  {
    label: "Stil tarifare",
    value: "Estimare înainte",
    hint: "Interfața afișează o estimare clară înainte de confirmarea comenzii.",
  },
  {
    label: "Logică finală",
    value: "După traseu",
    hint: "Suma finală depinde de traseu, profilul coletului și contextul operațional live.",
  },
] as const;

export default function PricingPage() {
  return (
    <div className="app-page-spacing flex flex-col gap-10 md:gap-14">
      <section id="pricing-overview" className="scroll-mt-28">
        <div className="flex flex-col gap-6">
          <PageHeader
            eyebrow="Tarife"
            title="Tarife simple, afișate ca estimare live de livrare."
            description="SkySend folosește un model clar de tarifare pentru Pitești: logică de bază pentru fiecare tip de livrare și o estimare vizibilă care se poate schimba după distanță, colet, urgență și disponibilitate live."
            actions={[
              {
                label: "Creează livrare",
                href: "/client/create-delivery",
                variant: "default",
                icon: <ArrowRight className="size-4" />,
              },
              {
                label: "Vezi acoperirea",
                href: "/#coverage",
                variant: "outline",
              },
            ]}
          />

          <div className="grid gap-4 md:grid-cols-3">
            {pricingSignals.map((item) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                hint={item.hint}
              />
            ))}
          </div>
        </div>
      </section>

      <PublicSection
        id="delivery-types"
        eyebrow="Tipuri de livrare"
        title="Trei moduri clare de livrare pentru serviciul curent."
        description="Modelul de tarifare rămâne ușor de înțeles: alegi modul de livrare, apoi verifici estimarea în fluxul comenzii."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;

            return (
              <Card
                key={plan.name}
                className="rounded-[var(--ui-radius-panel)] shadow-[var(--elevation-panel)]"
              >
                <CardHeader className="gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl border border-border/80 bg-secondary/45 text-foreground">
                      <Icon className="size-5" />
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {plan.description}
                  </p>

                  <div className="grid gap-3 rounded-[calc(var(--radius)+0.375rem)] border border-border/80 bg-secondary/45 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Timp estimat</p>
                      <p className="mt-2 font-heading text-2xl tracking-tight">
                        {plan.eta}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Logică tarifare</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {plan.pricing}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-foreground">{plan.highlight}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PublicSection>

      <PublicSection
        id="pricing-factors"
        eyebrow="Factori tarifare"
        title="Estimarea finală depinde de câteva date vizibile."
        description="SkySend evită limbajul complicat de tarifare. Fluxul comenzii arată simplu cum se poate modifica estimarea înainte de confirmare."
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.95fr)]">
          <SectionCard
            title="Ce poate schimba prețul final"
            description="Estimarea nu este finală până când traseul și profilul coletului sunt confirmate."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {pricingFactors.map((factor) => (
                <div
                  key={factor.title}
                  className="rounded-[calc(var(--radius)+0.375rem)] border border-border/80 bg-secondary/45 p-5"
                >
                  <h2 className="font-heading text-lg tracking-tight">
                    {factor.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {factor.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <Card className="rounded-[var(--ui-radius-panel)] shadow-[var(--elevation-panel)]">
            <CardContent className="grid gap-5 p-6 md:p-8">
              <div className="space-y-3">
                <h2 className="type-h2">Estimările sunt operaționale, nu absolute.</h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  Tarifele afișate pe această pagină sunt estimări de referință
                  pentru serviciul curent din Pitești. Suma din fluxul de
                  livrare poate depinde de distanță, tipul coletului, urgență și
                  disponibilitatea operațională live la momentul confirmării.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  "Tarifarea de bază păstrează pagina clară înainte să existe o comandă.",
                  "Fluxul de creare livrare întoarce o estimare specifică traseului înainte de plată.",
                  "Zona curentă de serviciu rămâne concentrată pe regulile de tarifare din Pitești.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[calc(var(--radius)+0.375rem)] border border-border/80 bg-secondary/45 p-4 text-sm leading-7 text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicSection>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-stretch">
        <Card className="h-full rounded-[var(--ui-radius-panel)] shadow-[var(--elevation-panel)]">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6 md:p-8">
            <div className="space-y-3">
              <h2 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl">
                Vezi estimarea în fluxul real de livrare.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Pagina de tarife explică modelul. Fluxul de comandă îl aplică pe
                un traseu real, cu profil de colet și urgență în zona activă Pitești.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <AppButton asChild size="lg">
                <Link href="/client/create-delivery">Creează livrare</Link>
              </AppButton>
              <AppButton asChild variant="outline" size="lg">
                <Link href="/how-it-works">Cum funcționează</Link>
              </AppButton>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full rounded-[var(--ui-radius-panel)] shadow-[var(--elevation-panel)]">
          <CardContent className="flex h-full flex-col justify-center gap-4 p-6 md:p-8">
            <p className="text-sm text-muted-foreground">Domeniu tarifare</p>
            <p className="font-heading text-2xl tracking-tight md:text-3xl">
              Model curent pentru Pitești.
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              Structura rămâne simplă, ca tarifele să se simtă parte din produs,
              nu ca o broșură comercială separată.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
