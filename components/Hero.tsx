"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Logo } from "@/components/Logo";
import { IconArrow } from "@/components/Icons";
import { GooglePlayBadge } from "@/components/GooglePlayBadge";
import { HeroStage } from "@/components/HeroStage";
import { GlassShatter } from "@/components/GlassShatter";
import { WhyContent } from "@/components/ProblemSection";
import { FADE, HANDOFF, SCRUB_SPRING } from "@/lib/shatter";
import { URLS } from "@/lib/urls";

/**
 * Hero → Why: one tall sticky pin.
 *
 * Desktop: parallax scrub → timed shatter → Why hold.
 * Scroll back below assembleBelow → reverse assemble → intact glass + scrub again.
 * Mobile / reduced-motion: in-place fade over Why.
 */
export function Hero() {
  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);

  /** Monotonic keys so shatter / assemble can replay every cycle. */
  const [playKey, setPlayKey] = useState(0);
  const [assembleKey, setAssembleKey] = useState(0);

  /** Intact glass covered by shards (hidden only after shards paint). */
  const [glassCovered, setGlassCovered] = useState(false);
  /** Why fully interactive after shatter completes. */
  const [whyRevealed, setWhyRevealed] = useState(false);
  /** Mid reverse-assemble — keep glass hidden until shards reunite. */
  const [assembling, setAssembling] = useState(false);

  const shatteredRef = useRef(false);
  const assemblingRef = useRef(false);
  const shatterModeRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches || window.innerWidth >= 1024);
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const scrubProgress = useSpring(scrollYProgress, SCRUB_SPRING);
  const scrub = reduce ? scrollYProgress : scrubProgress;

  const shatter = !reduce && desktop;
  shatterModeRef.current = shatter;
  const trigger = HANDOFF.trigger;

  // During assemble, glass is the base under converging shards.
  const showIntactGlass = !glassCovered || assembling;

  const applyProgress = (raw: number) => {
    const pin = pinRef.current;
    if (pin) pin.dataset.handoffNative = raw.toFixed(4);

    if (!shatterModeRef.current) return;
    if (assemblingRef.current) return;

    // Scroll back → reverse assemble into intact glass.
    if (raw < HANDOFF.assembleBelow && shatteredRef.current) {
      shatteredRef.current = false;
      assemblingRef.current = true;
      setAssembling(true);
      setWhyRevealed(false);
      // Show intact glass under the reverse shards so Why never flashes.
      setGlassCovered(false);
      const glass = glassRef.current;
      if (glass) {
        glass.style.opacity = "";
        glass.style.visibility = "";
        glass.style.pointerEvents = "";
      }
      setAssembleKey((k) => k + 1);
      return;
    }

    // Cross trigger → forward shatter (once per cycle).
    if (raw >= trigger && !shatteredRef.current && !assemblingRef.current) {
      shatteredRef.current = true;
      // Keep glass visible until GlassShatter paints shards (onPlayingChange).
      setPlayKey((k) => k + 1);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (raw) => {
    const pin = pinRef.current;
    if (pin) {
      pin.dataset.handoffRaw = raw.toFixed(4);
      pin.dataset.handoffScrub = scrub.get().toFixed(4);
    }
  });

  useEffect(() => {
    if (!shatter) return;

    const read = () => {
      const track = trackRef.current;
      if (!track) return;
      const range = track.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const top = track.getBoundingClientRect().top;
      const raw = Math.min(1, Math.max(0, -top / range));
      applyProgress(raw);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shatter]);

  const bgY = useTransform(scrub, [0, trigger], [0, 220]);
  const bgScale = useTransform(scrub, [0, trigger], [1.06, 1.22]);
  const washY = useTransform(scrub, [0, trigger], [0, 140]);
  const copyY = useTransform(scrub, [0, trigger], [0, -120]);
  const copyOpacity = useTransform(scrub, [0, trigger], [1, 0.55]);
  const stageY = useTransform(scrub, [0, trigger], [0, 160]);
  const stageOpacity = useTransform(scrub, [0, trigger], [1, 0.65]);
  const phoneY = useTransform(scrub, [0, trigger], [0, 120]);
  const phoneRotate = useTransform(scrub, [0, trigger], [0, -10]);
  const cardY = useTransform(scrub, [0, trigger], [0, 200]);
  const cardX = useTransform(scrub, [0, trigger], [0, 70]);
  const bubbleY = useTransform(scrub, [0, trigger], [0, -160]);
  const bubbleX = useTransform(scrub, [0, trigger], [0, -60]);
  const ringScale = useTransform(scrub, [0, trigger], [1, 1.35]);
  const orbA = useTransform(scrub, [0, trigger], [0, -200]);
  const orbB = useTransform(scrub, [0, trigger], [0, 240]);

  const fadeOpacity = useTransform(
    scrub,
    [0, FADE.start, FADE.mid, FADE.end],
    [1, 1, 0.35, 0],
  );
  const fadePointer = useTransform(scrub, (p) =>
    p >= FADE.mid ? "none" : "auto",
  );
  const fadeWhyPointer = useTransform(scrub, (p) =>
    p >= FADE.mid ? "auto" : "none",
  );
  const fadeVisibility = useTransform(scrub, (p) =>
    p >= FADE.end ? "hidden" : "visible",
  );

  const trackHeight = desktop ? HANDOFF.track.desktop : HANDOFF.track.mobile;

  return (
    <section
      ref={trackRef}
      id="top"
      data-handoff-track
      className="relative"
      style={{ height: trackHeight }}
      aria-label="PinkSurfing introduction"
    >
      <div
        id="why"
        className="pointer-events-none absolute left-0 top-[78%] h-px w-px"
        tabIndex={-1}
        aria-hidden
      />

      <div
        ref={pinRef}
        data-handoff-pin
        data-glass-covered={glassCovered ? "1" : "0"}
        data-why-revealed={whyRevealed ? "1" : "0"}
        className="sticky top-0 isolate h-[100svh] overflow-hidden"
      >
        {/* Why under-layer — never flashes before shatter paints */}
        <motion.div
          data-why-layer
          className={`absolute inset-0 flex items-center overflow-y-auto bg-ps-bg ${
            whyRevealed ? "z-20" : "z-0"
          }`}
          style={
            shatter
              ? {
                  // Always painted under opaque glass / shards — never flashes
                  // ahead of the break because glass stays up until shards paint.
                  pointerEvents: whyRevealed ? "auto" : "none",
                }
              : {
                  opacity: fadeOpacity,
                  visibility: fadeVisibility,
                  pointerEvents: fadeWhyPointer,
                }
          }
          aria-labelledby="why-heading"
          aria-hidden={shatter ? !whyRevealed : undefined}
        >
          <WhyContent />
        </motion.div>

        {/* Intact hero glass — stays up until shards are on screen */}
        <motion.div
          ref={glassRef}
          data-hero-glass
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
          style={
            shatter
              ? {
                  opacity: showIntactGlass ? 1 : 0,
                  visibility: showIntactGlass ? "visible" : "hidden",
                  pointerEvents: showIntactGlass ? "auto" : "none",
                }
              : {
                  opacity: fadeOpacity,
                  visibility: fadeVisibility,
                  pointerEvents: fadePointer,
                }
          }
          aria-labelledby="hero-heading"
        >
          <motion.div
            className="absolute inset-0 -z-30"
            style={
              reduce || !shatter ? undefined : { y: bgY, scale: bgScale }
            }
          >
            <div className="relative h-[140%] w-full -translate-y-[10%]">
              <Image
                src="/hero-atmosphere.jpg"
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </motion.div>

          <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(14,15,19,0.5)_0%,rgba(14,15,19,0.72)_45%,rgba(14,15,19,0.94)_100%)]" />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            style={reduce || !shatter ? undefined : { y: washY }}
          >
            <div className="absolute left-[-8%] top-[8%] h-[40vmin] w-[40vmin] rounded-full bg-[radial-gradient(circle,rgba(151,71,255,0.26),transparent_68%)]" />
            <div className="absolute bottom-0 right-0 h-[34vmin] w-[34vmin] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.2),transparent_70%)]" />
          </motion.div>

          <div className="ps-container relative grid w-full min-w-0 items-center gap-8 pb-10 pt-[max(6.5rem,calc(env(safe-area-inset-top)+4.75rem))] sm:gap-10 sm:pb-12 sm:pt-[max(7rem,calc(env(safe-area-inset-top)+5.25rem))] lg:grid-cols-2 lg:gap-12 lg:pb-8 lg:pt-20">
            <motion.div
              className="relative z-10 max-w-xl min-w-0"
              style={
                reduce || !shatter
                  ? undefined
                  : { y: copyY, opacity: copyOpacity }
              }
            >
              <div className="mb-5 min-w-0 md:mb-7">
                <Logo
                  size={48}
                  priority
                  className="max-w-full"
                  wordmarkClassName="ps-gradient-text text-[1.65rem] font-bold tracking-tight min-[400px]:text-[1.85rem] sm:text-4xl md:text-5xl lg:text-6xl"
                />
              </div>

              <h1
                id="hero-heading"
                className="text-balance text-[1.55rem] font-semibold leading-[1.2] tracking-tight text-ps-white min-[400px]:text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl"
              >
                Chat, shop, and sell — without switching worlds.
              </h1>

              <p className="mt-4 max-w-prose text-pretty text-[0.9375rem] leading-relaxed text-ps-muted sm:mt-5 sm:text-lg">
                PinkSurfing is the social business hub for messaging, marketplace
                shopping, and vendor selling — three products, one brand.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
                <a
                  href={URLS.app}
                  className="ps-btn-primary shrink-0 whitespace-nowrap !min-h-11 !gap-1.5 !px-5 !text-sm sm:!min-h-12 sm:!px-6 sm:!text-[0.9375rem]"
                >
                  Open App
                  <IconArrow />
                </a>
                <a
                  href={URLS.shop}
                  className="ps-btn-secondary shrink-0 whitespace-nowrap !min-h-11 !px-3.5 !text-sm sm:!min-h-11 sm:!px-4"
                >
                  Shop
                </a>
                <a
                  href="#why"
                  className="ps-btn-secondary shrink-0 whitespace-nowrap !min-h-11 !px-3.5 !text-sm sm:!min-h-11 sm:!px-4"
                >
                  How it works
                </a>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                <GooglePlayBadge height={44} />
                <p className="text-sm text-ps-dim">
                  iOS coming soon · Web app available now
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative z-10 mx-auto w-full min-w-0 max-w-[360px] sm:max-w-[400px] lg:mx-0 lg:max-w-none"
              style={
                reduce || !shatter
                  ? undefined
                  : { y: stageY, opacity: stageOpacity }
              }
            >
              <HeroStage
                phoneY={phoneY}
                phoneRotate={phoneRotate}
                cardY={cardY}
                cardX={cardX}
                bubbleY={bubbleY}
                bubbleX={bubbleX}
                ringScale={ringScale}
                orbA={orbA}
                orbB={orbB}
              />
            </motion.div>
          </div>
        </motion.div>

        {shatter ? (
          <GlassShatter
            captureRef={glassRef}
            playKey={playKey}
            assembleKey={assembleKey}
            className="z-40"
            onPlayingChange={(playing) => {
              // Only hide glass on forward shatter. During assemble, glass
              // stays visible under converging shards so Why never flashes.
              if (playing && !assemblingRef.current) {
                setGlassCovered(true);
                const glass = glassRef.current;
                if (glass) {
                  glass.style.opacity = "0";
                  glass.style.visibility = "hidden";
                  glass.style.pointerEvents = "none";
                }
              }
            }}
            onShatterComplete={() => {
              setWhyRevealed(true);
              setGlassCovered(true);
            }}
            onAssembleComplete={() => {
              assemblingRef.current = false;
              shatteredRef.current = false;
              setAssembling(false);
              setGlassCovered(false);
              setWhyRevealed(false);
              const glass = glassRef.current;
              if (glass) {
                glass.style.opacity = "";
                glass.style.visibility = "";
                glass.style.pointerEvents = "";
              }
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
