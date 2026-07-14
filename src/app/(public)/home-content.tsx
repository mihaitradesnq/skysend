"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { CoverageMapPreview } from "@/components/maps/coverage-map-preview";
import { PublicSection } from "@/components/layout/public-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/lib/settings/settings-context";
import { getPublicCopy } from "@/lib/i18n/public-copy";

export default function HomeContent() {
  const { language, theme } = useSettings();
  const copy = getPublicCopy(language);
  const isDark = theme === "dark";
  const cardHover = isDark ? "bg-card/95" : "bg-card";

  return (
    <>
      <HeroSection />

      <div className="bg-background">
        <div className="app-container app-page-spacing grid gap-16 md:gap-20">
          <MotionReveal preset="section" margin="-100px">
            <PublicSection
              id="how-it-works"
              eyebrow={copy.home.howItWorks.eyebrow}
              title={copy.home.howItWorks.title}
              description={copy.home.howItWorks.description}
            >
              <div className="grid gap-4 md:grid-cols-3">
                {copy.home.howItWorks.steps.map((step) => (
                  <MotionReveal
                    key={step.title}
                    preset="section"
                    margin="-80px"
                    className={`card-interactive rounded-[var(--ui-radius-card)] border border-border/80 p-5 ${cardHover}`}
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
              eyebrow={copy.home.coverage.eyebrow}
              title={copy.home.coverage.title}
              description={copy.home.coverage.description}
            >
              <CoverageMapPreview />
            </PublicSection>
          </MotionReveal>

          <MotionReveal preset="section" margin="-100px">
            <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]">
              <Card className="rounded-[var(--ui-radius-panel)] shadow-[var(--elevation-panel)]">
                <CardContent className="grid gap-6 p-6 md:p-8">
                  <div className="space-y-3">
                    <h2 className="type-h2">{copy.home.cta.title}</h2>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                      {copy.home.cta.body}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg">
                      <Link href="/client/create-delivery">
                        {copy.home.cta.primary}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/how-it-works">{copy.home.cta.secondary}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-[var(--ui-radius-panel)] border border-border/80 bg-card p-6">
                <HelpCircle className="size-5 text-primary" />
                <h2 className="mt-4 font-heading text-2xl tracking-tight">
                  {copy.home.faq.title}
                </h2>
                <div className="mt-5 grid gap-4">
                  {copy.home.faq.items.map((item) => (
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
                  <Link href="/contact">{copy.home.faq.contactCta}</Link>
                </Button>
              </div>
            </section>
          </MotionReveal>
        </div>
      </div>
    </>
  );
}