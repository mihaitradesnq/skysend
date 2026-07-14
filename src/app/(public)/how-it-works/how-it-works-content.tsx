"use client";

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
import { useSettings } from "@/lib/settings/settings-context";
import { getPublicCopy } from "@/lib/i18n/public-copy";

const OVERVIEW_ICONS = [Route, PackagePlus, Drone, Radar] as const;
const DETAILED_ICONS = [
  Route,
  LocateFixed,
  PackagePlus,
  Drone,
  CreditCard,
  Radar,
  Eye,
  KeyRound,
  PackageCheck,
  Link2,
  CheckCircle2,
] as const;

function StepNumber({ value }: { value: number }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-mono text-xs font-semibold text-primary">
      {String(value).padStart(2, "0")}
    </span>
  );
}

export default function HowItWorksContent() {
  const { language } = useSettings();
  const copy = getPublicCopy(language);
  const c = copy.howItWorks;

  return (
    <div className="grid gap-14 md:gap-18">
      <section className="overflow-hidden rounded-[var(--ui-radius-panel)] border border-border/80 bg-[radial-gradient(circle_at_80%_10%,rgba(20,184,166,0.16),transparent_32%),linear-gradient(135deg,rgba(4,18,17,0.98),rgba(2,8,8,0.98))] shadow-[var(--elevation-panel)]">
        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:items-end">
          <div className="max-w-3xl space-y-6">
            <div className="space-y-4">
              <h1 className="font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {c.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {c.heroBody}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/client/create-delivery">
                  {c.primaryCta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/#coverage">
                  {c.secondaryCta}
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
                <p className="font-medium text-foreground">{c.pinRuleTitle}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {c.pinRuleBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicSection
        id="overview"
        eyebrow={c.overview.eyebrow}
        title={c.overview.title}
        description={c.overview.description}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {c.overview.items.map((item, index) => {
            const Icon = OVERVIEW_ICONS[index] ?? Route;
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
          <h2 className="type-h2">{c.meetingPoints.title}</h2>
          <p className="type-subtitle">{c.meetingPoints.body1}</p>
          <p className="text-sm leading-7 text-muted-foreground">
            {c.meetingPoints.body2}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {c.meetingPoints.items.map((item) => (
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
          <h2 className="type-h2">{c.parcelProfile.title}</h2>
          <p className="type-subtitle">{c.parcelProfile.body1}</p>
          <p className="text-sm leading-7 text-muted-foreground">
            {c.parcelProfile.body2}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {c.parcelProfile.items.map((item) => (
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
          <h2 className="type-h2">{c.locker.title}</h2>
          <p className="type-subtitle">{c.locker.body}</p>
        </div>

        <div className="grid gap-3">
          {c.locker.facts.map((item) => (
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
          <h2 className="type-h2">{c.recipient.title}</h2>
          <p className="type-subtitle">{c.recipient.body}</p>
          <Button asChild variant="outline">
            <Link href="/tracking">
              {c.recipient.cta}
              <Link2 className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3">
          {c.recipient.steps.map((item) => (
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
          <h2 className="type-h2">{c.closing.title}</h2>
        </div>
        <div className="grid gap-4 lg:col-span-2">
          {c.closing.items.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicSection
        id="delivery-flow"
        eyebrow={c.detailedFlow.eyebrow}
        title={c.detailedFlow.title}
        description={c.detailedFlow.description}
      >
        <div className="grid gap-4">
          {c.detailedFlow.items.map((item, index) => {
            const Icon = DETAILED_ICONS[index] ?? Route;
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
            <h2 className="type-h2">{c.finalTitle}</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {c.finalBody}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button asChild size="lg">
              <Link href="/client/create-delivery">
                {c.finalPrimary}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">{c.finalSecondary}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}