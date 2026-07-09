import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Drone,
  Eye,
  KeyRound,
  Link2,
  LocateFixed,
  MapPinned,
  PackageCheck,
  PackagePlus,
  PackageSearch,
  Radar,
  Route,
  ShieldCheck,
} from "lucide-react";
import { PublicSection } from "@/components/layout/public-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Cum funcționează SkySend",
  "Ghid clar pentru ridicare, puncte de întâlnire, compartimentul dronei, PIN și urmărirea destinatarului pentru livrările SkySend în Pitești.",
);

const overviewSteps = [
  {
    title: "Setează traseul",
    body: "Alege punctul de ridicare și punctul de livrare în zona activă SkySend din Pitești.",
    icon: Route,
  },
  {
    title: "Pregătește coletul",
    body: "Adaugă mărimea, greutatea, ambalajul și detaliile de manipulare înainte de lansarea livrării.",
    icon: PackagePlus,
  },
  {
    title: "Alege drona",
    body: "Verifică drona recomandată, potrivirea compartimentului și timpul de lansare.",
    icon: Drone,
  },
  {
    title: "Urmărește livrarea",
    body: "Urmărește ETA-ul, ridicarea, zborul, predarea și finalizarea livrării.",
    icon: Radar,
  },
] as const;

const detailedFlow = [
  {
    title: "Setează ridicarea și livrarea",
    body: "Introdu adresele sau alege puncte pe hartă. SkySend verifică dacă ambele puncte sunt în zona activă Pitești.",
    icon: Route,
  },
  {
    title: "Alege punctul de întâlnire cu drona",
    body: "SkySend recomandă un punct apropiat și ușor de recunoscut, precum o intrare, o zonă la stradă sau un acces din parcare.",
    icon: LocateFixed,
  },
  {
    title: "Descrie coletul",
    body: "Adaugă greutatea, dimensiunea, ambalajul și fragilitatea. Asistentul de colet poate estima detaliile, iar tu le poți edita manual.",
    icon: PackagePlus,
  },
  {
    title: "Alege drona și lansează livrarea",
    body: "SkySend recomandă o dronă compatibilă pe baza coletului, traseului și timpului estimat. Poți alege și o altă opțiune compatibilă.",
    icon: Drone,
  },
  {
    title: "Verifică și plătește",
    body: "Verifică traseul, coletul, drona, ETA-ul, totalul estimat și detaliile livrării înainte de confirmarea plății.",
    icon: CreditCard,
  },
  {
    title: "Urmărește drona live",
    body: "După confirmare, livrarea apare în spațiul client cu stare în timp real, ETA și pași următori clari.",
    icon: Radar,
  },
  {
    title: "Întâlnește drona la ridicare",
    body: "Drona pleacă din centrul operațional SkySend Pitești către punctul de ridicare. Expeditorul confirmă că vede drona.",
    icon: Eye,
  },
  {
    title: "Folosește PIN-ul compartimentului",
    body: "Aplicația afișează PIN-ul la momentul potrivit. Expeditorul introduce codul pe tastatura compartimentului fizic al dronei.",
    icon: KeyRound,
  },
  {
    title: "Încarcă coletul",
    body: "Compartimentul se deschide sau coboară pentru încărcare. Expeditorul pune coletul înăuntru și confirmă „Colet încărcat” în aplicație.",
    icon: PackageCheck,
  },
  {
    title: "Destinatarul primește coletul",
    body: "Destinatarul deschide linkul de urmărire, vede ETA-ul, confirmă drona la predare, folosește PIN-ul pe tastatura fizică și ridică coletul.",
    icon: Link2,
  },
  {
    title: "Livrare finalizată",
    body: "SkySend marchează coletul ca livrat și păstrează comanda în istoricul clientului.",
    icon: CheckCircle2,
  },
] as const;

const meetingPointExamples = [
  "Punct lângă intrare",
  "Punct la stradă",
  "Acces din parcare",
  "Acces pietonal",
  "Intrare în parc",
] as const;

const parcelProfileHighlights = [
  "Descriere în cuvintele tale",
  "Greutate estimată",
  "Dimensiuni sugerate",
  "Ambalaj și fragilitate",
  "Confirmare înainte de aplicare",
] as const;

const lockerFacts = [
  "Drona transportă un compartiment securizat suspendat.",
  "Compartimentul poate coborî când drona ajunge la punctul de întâlnire.",
  "SkySend afișează PIN-ul doar când este necesar.",
  "PIN-ul se introduce pe tastatura fizică a compartimentului dronei, nu pe site.",
  "Expeditorul folosește PIN-ul pentru încărcarea coletului.",
  "Destinatarul folosește PIN-ul pentru ridicarea coletului.",
  "„Colet încărcat” și „Colet ridicat” sunt confirmări din aplicație după finalizarea acțiunii fizice.",
] as const;

const recipientSteps = [
  "Expeditorul trimite destinatarului linkul de urmărire.",
  "Destinatarul vede ETA-ul, etapa curentă și instrucțiunile de predare fără cont complet de client.",
  "Detaliile private despre client, cont și plată rămân ascunse.",
  "La predare, destinatarul confirmă că drona este vizibilă înainte de folosirea compartimentului.",
  "Când primește instrucțiunea, destinatarul introduce PIN-ul pe tastatura fizică și confirmă „Colet ridicat”.",
] as const;

function StepNumber({ value }: { value: number }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-mono text-xs font-semibold text-primary">
      {String(value).padStart(2, "0")}
    </span>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="grid gap-14 md:gap-18">
      <section className="overflow-hidden rounded-[var(--ui-radius-panel)] border border-border/80 bg-[radial-gradient(circle_at_80%_10%,rgba(20,184,166,0.16),transparent_32%),linear-gradient(135deg,rgba(4,18,17,0.98),rgba(2,8,8,0.98))] shadow-[var(--elevation-panel)]">
        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:items-end">
          <div className="max-w-3xl space-y-6">
            <div className="space-y-4">
              <h1 className="font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Cum funcționează SkySend
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                De la ridicare la predare, SkySend te ghidează prin fiecare
                pas al unei livrări sigure cu drona în Pitești.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/client/create-delivery">
                  Creează livrare
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/#coverage">
                  Verifică zona
                  <MapPinned className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-[calc(var(--radius)+0.5rem)] border border-primary/20 bg-background/72 p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <KeyRound className="size-5" />
              </span>
              <div>
                <p className="font-medium text-foreground">Regula PIN-ului compartimentului</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  PIN-ul se folosește pe compartimentul dronei, nu pe site.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicSection
        id="overview"
        eyebrow="Pe scurt"
        title="Patru decizii simple înainte de livrarea live."
        description="SkySend păstrează fluxul comenzii concentrat, dar explică și elementele diferite față de o livrare clasică."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewSteps.map((item, index) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="border-border/80 bg-card/90">
                <CardContent className="grid gap-5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <StepNumber value={index + 1} />
                    <span className="flex size-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-heading text-xl tracking-tight">
                      {item.title}
                    </h2>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PublicSection>

      <section className="grid gap-6 rounded-[var(--ui-radius-panel)] border border-border/80 bg-card p-6 shadow-[var(--elevation-panel)] md:p-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <h2 className="type-h2">De ce recomandă SkySend puncte de întâlnire</h2>
          <p className="type-subtitle">
            SkySend poate recomanda un loc apropiat în locul pinului exact,
            deoarece dronele au nevoie de zone accesibile și ușor de recunoscut.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            Recomandările folosesc datele disponibile de hartă și traseu.
            Utilizatorii trebuie să respecte regulile locale și să confirme
            că drona este vizibilă înainte de folosirea compartimentului.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {meetingPointExamples.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-[var(--ui-radius-card)] border border-border/80 bg-secondary/35 p-4"
            >
              <MapPinned className="size-4 shrink-0 text-primary" />
              <p className="text-sm font-medium text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[var(--ui-radius-panel)] border border-border/80 bg-card p-6 shadow-[var(--elevation-panel)] md:p-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <h2 className="type-h2">Cum estimează SkySend profilul coletului</h2>
          <p className="type-subtitle">
            Descrii coletul în limbaj natural, iar asistentul propune greutatea,
            dimensiunile, ambalajul și nivelul de fragilitate pentru potrivirea
            dronei.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            Estimarea nu se aplică automat. Clientul verifică profilul sugerat,
            îl poate ajusta și îl confirmă înainte ca SkySend să folosească
            datele pentru configurație, ETA și cost.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {parcelProfileHighlights.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-[var(--ui-radius-card)] border border-border/80 bg-secondary/35 p-4"
            >
              <PackageSearch className="size-4 shrink-0 text-primary" />
              <p className="text-sm font-medium text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[var(--ui-radius-panel)] border border-primary/20 bg-[linear-gradient(135deg,rgba(4,22,20,0.98),rgba(2,8,8,0.98))] p-6 shadow-[var(--elevation-panel)] md:p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <h2 className="type-h2">Cum funcționează compartimentul dronei</h2>
          <p className="type-subtitle">
            PIN-ul se folosește pe compartimentul dronei, nu pe site.
            SkySend afișează codul când este necesar, iar utilizatorul îl
            introduce direct pe tastatura fizică.
          </p>
        </div>

        <div className="grid gap-3">
          {lockerFacts.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-[var(--ui-radius-card)] border border-white/10 bg-white/[0.04] p-4"
            >
              <KeyRound className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[var(--ui-radius-panel)] border border-border/80 bg-card p-6 shadow-[var(--elevation-panel)] md:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
        <div className="space-y-4">
          <h2 className="type-h2">Destinatarul vede doar ce are nevoie.</h2>
          <p className="type-subtitle">
            Expeditorul poate trimite un link de urmărire dedicat, astfel încât
            destinatarul să se pregătească pentru predare fără detalii private
            despre client.
          </p>
          <Button asChild variant="outline">
            <Link href="/tracking">
              Deschide pagina de urmărire
              <Link2 className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3">
          {recipientSteps.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-[var(--ui-radius-card)] border border-border/80 bg-secondary/35 p-4"
            >
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[var(--ui-radius-panel)] border border-border/80 bg-card p-6 md:p-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          <h2 className="type-h2">Ghidat, nu lăsat pe presupuneri automate.</h2>
        </div>
        <div className="grid gap-4 lg:col-span-2">
          {[
            "Aplicația recomandă puncte de întâlnire ca ridicarea și predarea să fie mai ușor de înțeles.",
            "Expeditorul și destinatarul confirmă că drona este vizibilă înainte de folosirea compartimentului.",
            "SkySend nu promite că orice pin exact de pe hartă este un loc potrivit de întâlnire.",
            "Utilizatorii trebuie să respecte regulile locale și să evite zonele nesigure în timp ce așteaptă drona.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicSection
        id="delivery-flow"
        eyebrow="Flux detaliat"
        title="De la cerere la livrare finalizată."
        description="Fluxul complet arată ce se întâmplă în aplicație și ce se întâmplă fizic la compartimentul dronei."
      >
        <div className="grid gap-4">
          {detailedFlow.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="grid gap-3 rounded-[var(--ui-radius-card)] border border-border/80 bg-card/90 p-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start md:gap-4"
              >
                <div className="flex items-center justify-between gap-3 md:contents">
                  <StepNumber value={index + 1} />
                  <span className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary md:order-last">
                    <Icon className="size-5" />
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading text-xl tracking-tight text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </PublicSection>

      <section className="rounded-[var(--ui-radius-panel)] border border-primary/15 bg-[radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.18),transparent_36%),linear-gradient(135deg,rgba(7,26,24,0.96),rgba(2,8,8,0.98))] p-6 shadow-[var(--elevation-panel)] md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-2xl space-y-2">
            <h2 className="type-h2">Creează o livrare în zona activă.</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Începe cu acoperirea, confirmă punctele de întâlnire cu drona,
              apoi urmează fluxul ghidat de livrare.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button asChild size="lg">
              <Link href="/client/create-delivery">
                Creează livrare
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">Vezi tarifele</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
