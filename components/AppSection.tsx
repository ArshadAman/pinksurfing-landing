"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { PoweredBySquare } from "@/components/SquareLogo";
import { IconArrow, IconBag, IconCall, IconChat } from "@/components/Icons";
import {
  MockCallUi,
  MockChatUi,
  MockPayChatUi,
} from "@/components/mocks/AppUiMocks";
import { motionTokens } from "@/lib/motion";
import { URLS } from "@/lib/urls";

const chapters = [
  {
    id: "messaging",
    icon: IconChat,
    eyebrow: "Stay connected",
    title: "Chat, groups, and stories that keep relationships warm",
    body: "Talk one-to-one or in groups, share stories that disappear after 24 hours, and get notified when a reply matters.",
    points: [
      "Secure chat with connections and groups",
      "Stories that expire after a day",
      "Notifications for messages and calls",
    ],
    Mock: MockChatUi,
  },
  {
    id: "calls",
    icon: IconCall,
    eyebrow: "Go live",
    title: "Voice and video without leaving the thread",
    body: "When text is too slow, jump into a call from the same conversation and keep the context intact.",
    points: [
      "Voice calls from chat",
      "Video when you need face-to-face",
      "Built for business conversations",
    ],
    Mock: MockCallUi,
  },
  {
    id: "paychat",
    icon: IconBag,
    eyebrow: "Get paid",
    title: "PayChat, contracts, and wallet tools in one flow",
    body: "Share a PayChat card for pay-per-message — once you’re paid, you can send unlimited messages back.",
    points: [
      "Pay per message — not timed sessions",
      "Unlimited replies for the person who got paid",
      "Contracts and wallet tools in the same app",
    ],
    Mock: MockPayChatUi,
  },
] as const;

export function AppSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  /** Pause chapter changes while the sticky demo has focus (chat typing, etc.). */
  const demoLockedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.985, 1.01, 1.02],
  );

  // Chapter = which left article is in the viewport focus band.
  // Friction comes from tall articles (min-h), not timers — timers were auto-skipping to ch.3.
  useEffect(() => {
    const nodes = articleRefs.current.filter(Boolean) as HTMLElement[];
    if (nodes.length === 0) return;

    const ratios = new Map<string, number>();

    const pick = () => {
      if (demoLockedRef.current) return;
      let bestIdx = 0;
      let bestRatio = -1;
      chapters.forEach((chapter, i) => {
        const r = ratios.get(chapter.id) ?? 0;
        if (r > bestRatio) {
          bestRatio = r;
          bestIdx = i;
        }
      });
      setActive((prev) => (prev === bestIdx ? prev : bestIdx));
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.chapterId;
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        pick();
      },
      {
        // Middle band of the viewport — article must occupy this to win.
        root: null,
        rootMargin: "-28% 0px -42% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // Unlock demo scrub lock when the user intentionally scrolls the page.
  useEffect(() => {
    const unlock = () => {
      if (!demoLockedRef.current) return;
      demoLockedRef.current = false;
      const el = document.activeElement;
      if (el instanceof HTMLElement && el.closest("[data-app-demo]")) {
        el.blur();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      unlock();
    };
    window.addEventListener("wheel", unlock, { passive: true });
    window.addEventListener("touchmove", unlock, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", unlock);
      window.removeEventListener("touchmove", unlock);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const lockDemo = () => {
    demoLockedRef.current = true;
  };

  const ActiveMock = chapters[active]?.Mock ?? MockChatUi;

  return (
    <section id="app" className="ps-section pt-0" aria-labelledby="app-heading">
      <div className="ps-container pt-[clamp(3rem,8vw,5.5rem)]">
        <Reveal className="max-w-3xl">
          <p className="ps-eyebrow">App · app.pinksurfing.com</p>
          <h2
            id="app-heading"
            className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-ps-white sm:text-4xl md:text-[2.75rem] md:leading-[1.15]"
          >
            The social business app for people who chat and close.
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ps-muted sm:text-lg">
            Messaging, calls, and PayChat (pay-per-message — unlimited replies
            once you’re paid), plus contracts and wallet tools.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={URLS.app} className="ps-btn-primary w-full sm:w-auto">
              Open web app
              <IconArrow />
            </a>
          </div>
          <PoweredBySquare
            className="mt-6"
            note="Receiving PayChat: United States only"
          />
        </Reveal>

        <div
          ref={trackRef}
          className="relative mt-16 grid min-w-0 gap-10 lg:mt-20 lg:grid-cols-2 lg:items-stretch lg:gap-14 xl:gap-20"
        >
          <div className="relative z-10 min-w-0">
            {chapters.map((chapter, index) => {
              const Icon = chapter.icon;
              const ChapterMock = chapter.Mock;
              const isActive = active === index;
              return (
                <article
                  key={chapter.id}
                  id={`app-${chapter.id}`}
                  data-chapter-id={chapter.id}
                  ref={(el) => {
                    articleRefs.current[index] = el;
                  }}
                  className="flex min-w-0 flex-col justify-center border-t border-white/8 py-8 first:border-t-0 sm:py-10 lg:min-h-[90svh] lg:py-20"
                  aria-current={isActive ? "true" : undefined}
                >
                  <div
                    className={`min-w-0 rounded-2xl border p-4 transition-[border-color,background,box-shadow] duration-300 sm:rounded-3xl sm:p-6 md:p-7 ${
                      isActive
                        ? "border-white/18 bg-ps-surf/70 shadow-[0_0_0_1px_rgba(236,72,153,0.12)]"
                        : "border-transparent bg-transparent opacity-70 lg:opacity-45"
                    }`}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <p className="ps-eyebrow !mb-0">
                        <Icon className="h-4 w-4" />
                        {chapter.eyebrow}
                      </p>
                      <span className="font-mono text-[11px] text-ps-dim">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(chapters.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="max-w-lg text-balance text-2xl font-semibold tracking-tight text-ps-white sm:text-3xl">
                      {chapter.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-base leading-relaxed text-ps-muted">
                      {chapter.body}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {chapter.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm leading-relaxed text-ps-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ps-pink-soft"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 max-w-full overflow-x-clip overflow-hidden rounded-2xl border border-white/8 sm:mt-6 lg:hidden">
                      <ChapterMock />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="relative hidden min-h-0 min-w-0 lg:block">
            <div className="sticky top-24 z-20 flex max-h-[calc(100svh-6.5rem)] flex-col justify-center self-start">
              <motion.div
                data-app-demo
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-ps-card shadow-[0_24px_80px_rgba(0,0,0,0.4)] will-change-transform"
                style={reduce ? undefined : { scale: mediaScale }}
                onPointerDownCapture={lockDemo}
                onFocusCapture={lockDemo}
              >
                <div className="border-b border-white/8 px-4 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ps-pink-soft">
                        {chapters[active]?.eyebrow}
                      </p>
                      <p className="mt-1 text-sm text-ps-muted">
                        Chapter {active + 1} of {chapters.length}
                      </p>
                    </div>
                    <div className="flex gap-1.5" aria-hidden>
                      {chapters.map((c, i) => (
                        <span
                          key={c.id}
                          className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                            i === active
                              ? "bg-ps-pink-soft"
                              : i < active
                                ? "bg-ps-purple-light/60"
                                : "bg-white/12"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full origin-left bg-gradient-to-r from-ps-pink-soft to-ps-primary"
                      style={
                        reduce
                          ? {
                              width: `${((active + 1) / chapters.length) * 100}%`,
                            }
                          : { width: progressWidth }
                      }
                    />
                  </div>
                </div>

                <div className="relative min-h-[520px]">
                  {reduce ? (
                    <div className="absolute inset-0 overflow-hidden [&_>div]:!min-h-full">
                      <ActiveMock />
                    </div>
                  ) : (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={chapters[active].id}
                        initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -18, filter: "blur(3px)" }}
                        transition={{
                          duration: motionTokens.duration.moderate,
                          ease: motionTokens.easing.soft,
                        }}
                        className="absolute inset-0 overflow-hidden [&_>div]:!min-h-full"
                      >
                        <ActiveMock />
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
