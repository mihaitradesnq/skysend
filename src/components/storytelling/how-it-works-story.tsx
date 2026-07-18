"use client";

import Image from "next/image";
import Link from "next/link";
import type { MotionValue } from "motion/react";
import { m, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, MoveUpRight } from "lucide-react";
import type { PublicCopy } from "@/lib/i18n/public-copy";
import { storytellingAssets } from "@/lib/storytelling-assets";
import { ChapterProgressRail } from "./chapter-progress-rail";
import { SchematicBuilding, SchematicWorld } from "./schematic-world";
import { ScrollScrubVideo } from "./scroll-scrub-video";
import { StoryChapter } from "./story-chapter";
import { VCurvedTransition } from "./v-curved-transition";
import styles from "./storytelling.module.css";

type HowStoryCopy = PublicCopy["howItWorks"]["story"];
type SceneCopy = HowStoryCopy["scenes"][number];

function SceneCopyBlock({
  progress,
  scene,
  align = "left",
}: {
  progress: MotionValue<number>;
  scene: SceneCopy;
  align?: "left" | "right";
}) {
  const opacity = useTransform(progress, [0.04, 0.17, 0.78, 0.92], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.04, 0.24], [32, 0]);

  return (
    <m.header
      className={align === "right" ? styles.howSceneCopyRight : styles.howSceneCopy}
      style={{ opacity, y }}
    >
      <p>{scene.eyebrow}</p>
      <h2>{scene.title}</h2>
      <span>{scene.body}</span>
    </m.header>
  );
}

function DepartureScene({
  progress,
  copy,
  scene,
}: {
  progress: MotionValue<number>;
  copy: HowStoryCopy;
  scene: SceneCopy;
}) {
  const introOpacity = useTransform(progress, [0, 0.1, 0.3, 0.44], [1, 1, 1, 0]);
  const introY = useTransform(progress, [0, 0.4], [0, -56]);
  const sceneOpacity = useTransform(progress, [0.3, 0.43, 0.82, 0.94], [0, 1, 1, 0]);
  const droneX = useTransform(progress, [0.08, 0.76], ["8vw", "55vw"]);
  const droneY = useTransform(progress, [0.06, 0.55, 0.8], ["24vh", "-8vh", "-20vh"]);
  const droneScale = useTransform(progress, [0, 0.62], [0.62, 0.9]);
  const droneRotate = useTransform(progress, [0.15, 0.7], [-4, 2]);

  return (
    <div className={styles.howScene}>
      <SchematicWorld progress={progress} variant="hub" />
      <m.header className={styles.howIntro} style={{ opacity: introOpacity, y: introY }}>
        <p>{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <span>{copy.intro}</span>
        <small><ArrowDown aria-hidden="true" />{copy.scrollHint}</small>
      </m.header>

      <m.div
        className={styles.howDrone}
        style={{ x: droneX, y: droneY, scale: droneScale, rotate: droneRotate }}
        aria-hidden="true"
      >
        <Image
          src={storytellingAssets.product.drone}
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 72vw, 38vw"
          className={styles.containImage}
        />
      </m.div>

      <m.header className={styles.departureCopy} style={{ opacity: sceneOpacity }}>
        <p>{scene.eyebrow}</p>
        <h2>{scene.title}</h2>
        <span>{scene.body}</span>
      </m.header>
      <VCurvedTransition progress={progress} color="#07131d" variant="peak" />
    </div>
  );
}

function ArrivalScene({ progress, scene }: { progress: MotionValue<number>; scene: SceneCopy }) {
  const droneX = useTransform(progress, [0.03, 0.82], ["-34vw", "38vw"]);
  const droneY = useTransform(progress, [0, 0.3, 0.66, 0.88], ["22vh", "-12vh", "4vh", "-9vh"]);
  const droneScale = useTransform(progress, [0, 0.52, 0.82], [0.7, 1, 0.78]);

  return (
    <div className={styles.howSceneAlt}>
      <SchematicWorld progress={progress} variant="route" />
      <SceneCopyBlock progress={progress} scene={scene} align="right" />
      <m.div
        className={styles.arrivalDrone}
        style={{ x: droneX, y: droneY, scale: droneScale }}
        aria-hidden="true"
      >
        <Image
          src={storytellingAssets.product.rigThreeQuarter}
          alt=""
          fill
          sizes="(max-width: 767px) 82vw, 46vw"
          className={styles.containImage}
        />
      </m.div>
      <VCurvedTransition progress={progress} color="#050b14" variant="valley" />
    </div>
  );
}

function AlphaSequenceScene({
  progress,
  scene,
  sequence,
  building,
  distance,
  tone = "base",
}: {
  progress: MotionValue<number>;
  scene: SceneCopy;
  sequence: "lowerLocker" | "pickup" | "delivery";
  building?: boolean;
  distance: string;
  tone?: "base" | "violet";
}) {
  const asset = storytellingAssets.sequences[sequence];
  const videoScale = useTransform(progress, [0, 0.72], [1.05, 0.96]);

  return (
    <div className={tone === "violet" ? styles.howSceneViolet : styles.howScene}>
      <SchematicWorld progress={progress} />
      {building ? <SchematicBuilding progress={progress} distanceLabel={distance} /> : null}
      <SceneCopyBlock progress={progress} scene={scene} />
      <m.div className={styles.howSequenceVideo} style={{ scale: videoScale }}>
        <ScrollScrubVideo
          progress={progress}
          desktopSrc={asset.desktop}
          mobileSrc={asset.mobile}
          desktopPoster={asset.posterDesktop}
          mobilePoster={asset.posterMobile}
          fallbackDesktop={asset.fallbackDesktop}
          fallbackMobile={asset.fallbackMobile}
          objectFit="contain"
        />
      </m.div>
      <VCurvedTransition
        progress={progress}
        color={tone === "violet" ? "#050b14" : "#07131d"}
        variant={sequence === "pickup" ? "peak" : "valley"}
      />
    </div>
  );
}

function FlightScene({ progress, scene }: { progress: MotionValue<number>; scene: SceneCopy }) {
  const x = useTransform(progress, [0.02, 0.9], ["-36vw", "42vw"]);
  const y = useTransform(progress, [0, 0.35, 0.72, 1], ["15vh", "-12vh", "6vh", "-16vh"]);
  const scale = useTransform(progress, [0, 0.48, 1], [0.68, 1.08, 0.78]);

  return (
    <div className={styles.flightScene}>
      <SchematicWorld progress={progress} variant="route" />
      <SceneCopyBlock progress={progress} scene={scene} />
      <div className={styles.flightWord} aria-hidden="true">SKYSEND</div>
      <m.div className={styles.flightDrone} style={{ x, y, scale }} aria-hidden="true">
        <Image
          src={storytellingAssets.product.rigThreeQuarter}
          alt=""
          fill
          sizes="(max-width: 767px) 88vw, 52vw"
          className={styles.containImage}
        />
      </m.div>
      <VCurvedTransition progress={progress} color="#081018" variant="peak" />
    </div>
  );
}

function DeliveryScene({
  progress,
  scene,
  copy,
}: {
  progress: MotionValue<number>;
  scene: SceneCopy;
  copy: HowStoryCopy;
}) {
  const asset = storytellingAssets.sequences.delivery;
  const sceneCopyOpacity = useTransform(progress, [0.04, 0.15, 0.58, 0.72], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(progress, [0.66, 0.79], [0, 1]);
  const ctaY = useTransform(progress, [0.66, 0.84], [36, 0]);
  const videoScale = useTransform(progress, [0, 0.72, 1], [1.04, 0.94, 0.86]);
  const videoX = useTransform(progress, [0, 0.7, 1], ["10vw", "16vw", "24vw"]);

  return (
    <div className={styles.deliveryScene}>
      <SchematicWorld progress={progress} />
      <m.header className={styles.howSceneCopy} style={{ opacity: sceneCopyOpacity }}>
        <p>{scene.eyebrow}</p>
        <h2>{scene.title}</h2>
        <span>{scene.body}</span>
      </m.header>

      <m.div className={styles.deliveryVideo} style={{ scale: videoScale, x: videoX }}>
        <ScrollScrubVideo
          progress={progress}
          desktopSrc={asset.desktop}
          mobileSrc={asset.mobile}
          desktopPoster={asset.posterDesktop}
          mobilePoster={asset.posterMobile}
          fallbackDesktop={asset.fallbackDesktop}
          fallbackMobile={asset.fallbackMobile}
          objectFit="contain"
        />
      </m.div>

      <m.div className={styles.deliveryCta} style={{ opacity: ctaOpacity, y: ctaY }}>
        <p>{copy.finalTitle}</p>
        <span>{copy.finalBody}</span>
        <div className={styles.ctaActions}>
          <Link href="/client/create-delivery" className={styles.primaryStoryButton}>
            {copy.finalPrimary}<MoveUpRight aria-hidden="true" />
          </Link>
          <Link href="/pricing" className={styles.secondaryStoryButton}>
            {copy.finalSecondary}<ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </m.div>
    </div>
  );
}

export function HowItWorksStory({ copy }: { copy: HowStoryCopy }) {
  const labels = copy.scenes.map((scene) => scene.label);
  const [departure, arrival, descent, pickup, flight, delivery] = copy.scenes;

  return (
    <div id="how-story" className={styles.storyRoot}>
      <ChapterProgressRail rootId="how-story" labels={labels} ariaLabel={copy.railAria} />

      <StoryChapter id="how-departure" label={departure.label} screens={2.75}>
        {(progress) => <DepartureScene progress={progress} copy={copy} scene={departure} />}
      </StoryChapter>
      <StoryChapter id="how-arrival" label={arrival.label} screens={2.55}>
        {(progress) => <ArrivalScene progress={progress} scene={arrival} />}
      </StoryChapter>
      <StoryChapter id="how-descent" label={descent.label} screens={3.05}>
        {(progress) => (
          <AlphaSequenceScene
            progress={progress}
            scene={descent}
            sequence="lowerLocker"
            building
            distance={copy.distance}
          />
        )}
      </StoryChapter>
      <StoryChapter id="how-pickup" label={pickup.label} screens={3.15}>
        {(progress) => (
          <AlphaSequenceScene
            progress={progress}
            scene={pickup}
            sequence="pickup"
            distance={copy.distance}
            tone="violet"
          />
        )}
      </StoryChapter>
      <StoryChapter id="how-flight" label={flight.label} screens={2.6}>
        {(progress) => <FlightScene progress={progress} scene={flight} />}
      </StoryChapter>
      <StoryChapter id="how-delivery" label={delivery.label} screens={3.45}>
        {(progress) => <DeliveryScene progress={progress} scene={delivery} copy={copy} />}
      </StoryChapter>
    </div>
  );
}
