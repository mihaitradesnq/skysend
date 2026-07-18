"use client";

import type { MotionValue } from "motion/react";
import type { PublicCopy } from "@/lib/i18n/public-copy";
import { storytellingAssets } from "@/lib/storytelling-assets";
import { ScrollCue } from "./scroll-cue";
import { ScrollScrubVideo } from "./scroll-scrub-video";
import { StoryChapter } from "./story-chapter";
import { VCurvedTransition } from "./v-curved-transition";
import styles from "./storytelling.module.css";

type HowStoryCopy = PublicCopy["howItWorks"]["story"];

function HowItWorksHero({
  progress,
  copy,
}: {
  progress: MotionValue<number>;
  copy: HowStoryCopy;
}) {
  const sky = storytellingAssets.landingWeather.sky;

  return (
    <div className={styles.howHeroScene}>
      <ScrollScrubVideo
        progress={progress}
        desktopSrc={sky.desktop}
        mobileSrc={sky.mobile}
        desktopPoster={sky.posterDesktop}
        mobilePoster={sky.posterMobile}
        eager
        seekMode="direct"
        mediaClassName={styles.howHeroVideo}
      />
      <div className={styles.howHeroShade} aria-hidden="true" />
      <header className={styles.howHeroCopy}>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
        <ScrollCue ariaLabel={copy.scrollHint} />
      </header>
      <VCurvedTransition
        progress={progress}
        color="var(--how-next-scene-color)"
        variant="valley"
        progressRange={[0.74, 1]}
        referenceCurve
      />
    </div>
  );
}

export function HowItWorksStory({ copy }: { copy: HowStoryCopy }) {
  return (
    <div id="how-story" className={styles.howStoryRoot}>
      <StoryChapter id="how-hero" label={copy.title} screens={4}>
        {(progress) => <HowItWorksHero progress={progress} copy={copy} />}
      </StoryChapter>
      <section className={styles.howNextScene} aria-hidden="true" />
    </div>
  );
}
