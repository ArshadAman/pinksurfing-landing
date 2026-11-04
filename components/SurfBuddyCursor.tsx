"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

type Mood = "idle" | "pointer" | "text" | "grab" | "press" | "busy";

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/** Pointer flicks shared into the surf physics loop (rail pressure). */
const pointerFlick = { dx: 0 };

/**
 * Soft surf-buddy cursor. Face reacts to context; a hand only appears
 * when there is something to point at or grab. Scrolling drives real
 * surf physics — pitch, carve, wave heave, and water drag.
 */
export function SurfBuddyCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mood, setMood] = useState<Mood>("idle");
  const [visible, setVisible] = useState(false);
  const [blink, setBlink] = useState(false);
  const [surfing, setSurfing] = useState(false);
  const [boardTip, setBoardTip] = useState(-12);
  const pressing = useRef(false);
  const moodBeforePress = useRef<Mood>("idle");
  const surfingRef = useRef(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 560, damping: 42, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 560, damping: 42, mass: 0.5 });
  const lean = useSpring(0, { stiffness: 180, damping: 22 });
  const scale = useSpring(1, { stiffness: 400, damping: 26 });
  const bounce = useSpring(0, { stiffness: 280, damping: 18 });

  // Surf physics springs — heavier mass = board feel
  const pitch = useSpring(0, { stiffness: 110, damping: 14, mass: 0.95 });
  const carve = useSpring(0, { stiffness: 90, damping: 12, mass: 1.05 });
  const heave = useSpring(0, { stiffness: 160, damping: 11, mass: 0.7 });
  const sway = useSpring(0, { stiffness: 140, damping: 15, mass: 0.8 });

  const totalRotate = useTransform(
    [lean, pitch, carve],
    ([l, p, c]) => (l as number) + (p as number) + (c as number) * 0.35,
  );
  const totalX = useTransform([x, sway], ([a, b]) => (a as number) + (b as number));
  const totalY = useTransform(
    [y, heave, bounce],
    ([a, b, c]) => (a as number) + (b as number) + (c as number),
  );

  useMotionValueEvent(pitch, "change", (v) => {
    setBoardTip(clamp(-12 + v * 0.85, -34, 18));
  });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, [reduce]);

  useEffect(() => {
    if (!enabled || reduce) return;
    if (mood === "press") return;

    let cancelled = false;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          if (cancelled) return;
          setBlink(true);
          window.setTimeout(() => {
            if (!cancelled) setBlink(false);
            schedule();
          }, 100);
        },
        2600 + Math.random() * 2400,
      );
    };
    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      setBlink(false);
    };
  }, [enabled, reduce, mood]);

  // Scroll → surf physics loop
  useEffect(() => {
    if (!enabled || reduce) return;

    const state = {
      vy: 0,
      travel: 0,
      carvePhase: 0,
      lastScrollY: window.scrollY,
      lastT: performance.now(),
      pointerDx: 0,
    };

    let raf = 0;

    const onScroll = () => {
      const yNow = window.scrollY;
      const dy = yNow - state.lastScrollY;
      state.lastScrollY = yNow;
      // Impulse into the water — scrolling down = riding face-on
      state.vy += dy * 12;
      state.vy = clamp(state.vy, -2200, 2200);
    };

    const tick = (t: number) => {
      const dt = clamp((t - state.lastT) / 1000, 0.001, 0.05);
      state.lastT = t;

      // Water drag (quadratic-ish feel via stronger decay at speed)
      const speed = Math.abs(state.vy);
      const drag = 2.4 + speed * 0.0018;
      state.vy *= Math.exp(-drag * dt);

      // Tiny residual chop so it never feels frozen mid-wave
      if (speed < 8) state.vy *= 0.92;

      state.travel += state.vy * dt;
      state.carvePhase += dt * (1.2 + speed * 0.006);

      const riding = speed > 40;
      if (riding !== surfingRef.current) {
        surfingRef.current = riding;
        setSurfing(riding);
      }

      // Pitch: nose dips when scrolling down, lifts when scrolling up
      const targetPitch = clamp(state.vy * 0.012, -26, 26);

      // Pointer flick feeds into rail pressure
      state.pointerDx += pointerFlick.dx * 0.65;
      state.pointerDx = clamp(state.pointerDx, -40, 40);
      pointerFlick.dx = 0;

      // Carve S-turns grow with speed (rail-to-rail)
      const carveAmp = clamp(speed * 0.008, 0, 16);
      const carveAngle =
        Math.sin(state.carvePhase) * carveAmp + state.pointerDx * 0.35;

      // Wave heave + chop from distance traveled on the "face"
      const wave =
        Math.sin(state.travel * 0.014) * clamp(speed * 0.006, 0, 10);
      const chop =
        Math.sin(state.travel * 0.037 + 1.2) * clamp(speed * 0.0025, 0, 3.5);
      // Compression when landing a fast scroll impulse
      const compress = clamp(-Math.abs(state.vy) * 0.0015, -5, 0);

      // Lateral sway from carving (centripetal lean)
      const swayTarget =
        carveAngle * 0.45 +
        Math.sin(state.carvePhase * 0.5) * clamp(speed * 0.002, 0, 4);

      pitch.set(targetPitch);
      carve.set(carveAngle);
      heave.set(wave + chop + compress);
      sway.set(swayTarget);

      // Ease rail pressure back (fins release)
      state.pointerDx *= Math.exp(-3.2 * dt);

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      pitch.set(0);
      carve.set(0);
      heave.set(0);
      sway.set(0);
      surfingRef.current = false;
      setSurfing(false);
    };
  }, [enabled, reduce, pitch, carve, heave, sway]);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("ps-buddy-cursor");

    let lastX = 0;
    let leanTimer = 0;
    let hopTimer = 0;

    const applyMood = (next: Mood) => {
      if (pressing.current && next !== "press") return;
      setMood(next);

      switch (next) {
        case "pointer":
          scale.set(1.08);
          bounce.set(-3);
          window.clearTimeout(hopTimer);
          hopTimer = window.setTimeout(() => bounce.set(0), 150);
          break;
        case "text":
          scale.set(1.02);
          bounce.set(0);
          break;
        case "grab":
          scale.set(1.06);
          bounce.set(-2);
          break;
        case "press":
          scale.set(0.9);
          bounce.set(3);
          break;
        case "busy":
          scale.set(0.97);
          bounce.set(0);
          break;
        default:
          scale.set(1);
          bounce.set(0);
      }
    };

    const resolveMood = (el: Element | null): Mood => {
      if (!el) return "idle";
      if (el.closest("[aria-busy='true'], .ps-busy, [data-cursor='busy']"))
        return "busy";
      if (
        el.closest(
          "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']), textarea, select, [contenteditable='true'], [contenteditable=''], [data-cursor='text']",
        )
      )
        return "text";
      if (el.closest("[draggable='true'], [data-cursor='grab'], .ps-grab"))
        return "grab";

      let node: Element | null = el;
      for (let i = 0; i < 6 && node; i++) {
        const cursor = getComputedStyle(node).cursor;
        if (cursor === "text" || cursor === "vertical-text") return "text";
        if (cursor === "grab" || cursor === "move" || cursor === "grabbing")
          return "grab";
        if (cursor === "wait" || cursor === "progress") return "busy";
        if (cursor === "pointer" || cursor === "alias" || cursor === "copy")
          return "pointer";
        node = node.parentElement;
      }

      if (
        el.closest(
          "a, button, summary, label, [role='button'], [role='link'], [role='tab'], [role='menuitem'], .ps-btn-primary, .ps-btn-secondary, [data-cursor='pointer']",
        )
      )
        return "pointer";

      return "idle";
    };

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      pointerFlick.dx += dx;
      lean.set(clamp(dx * 0.4, -10, 10));
      setVisible(true);
      window.clearTimeout(leanTimer);
      leanTimer = window.setTimeout(() => lean.set(0), 100);
      if (!pressing.current)
        applyMood(resolveMood(e.target instanceof Element ? e.target : null));
    };

    const onOver = (e: PointerEvent) => {
      if (pressing.current) return;
      applyMood(resolveMood(e.target instanceof Element ? e.target : null));
    };

    const onDown = (e: PointerEvent) => {
      const base = resolveMood(e.target instanceof Element ? e.target : null);
      moodBeforePress.current = base;
      pressing.current = true;
      applyMood("press");
      if (base === "grab") scale.set(0.94);
    };

    const onUp = (e: PointerEvent) => {
      pressing.current = false;
      applyMood(resolveMood(e.target instanceof Element ? e.target : null));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("ps-buddy-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      window.clearTimeout(leanTimer);
      window.clearTimeout(hopTimer);
      pointerFlick.dx = 0;
    };
  }, [enabled, rawX, rawY, lean, scale, bounce]);

  if (!enabled) return null;

  const showHand =
    mood === "pointer" ||
    mood === "grab" ||
    (mood === "press" &&
      (moodBeforePress.current === "pointer" ||
        moodBeforePress.current === "grab"));

  const handMode: "point" | "grab" =
    mood === "grab" ||
    (mood === "press" && moodBeforePress.current === "grab")
      ? "grab"
      : "point";

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
      style={{
        x: totalX,
        y: totalY,
        rotate: totalRotate,
        scale,
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="relative h-0 w-0">
        <BuddyFace
          mood={mood}
          blink={blink}
          handOut={showHand}
          surfing={surfing}
          boardTip={boardTip}
        />
        <AnimatePresence>
          {showHand ? (
            <BuddyHand key="hand" mode={handMode} pressing={mood === "press"} />
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {surfing ? <SurfSpray key="spray" /> : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SurfSpray() {
  return (
    <motion.div
      className="absolute left-[-6px] top-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <svg width="36" height="20" viewBox="0 0 36 20" className="overflow-visible">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            cx={8 + i * 5}
            cy={10}
            r={1.2 + (i % 2) * 0.6}
            fill="#fff"
            opacity={0.55}
            animate={{
              x: [0, -6 - i * 2, -12 - i * 3],
              y: [0, -3 - (i % 3), 2 + (i % 2)],
              opacity: [0.7, 0.45, 0],
              scale: [1, 1.2, 0.6],
            }}
            transition={{
              duration: 0.55 + i * 0.08,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.05,
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

function BuddyFace({
  mood,
  blink,
  handOut,
  surfing,
  boardTip,
}: {
  mood: Mood;
  blink: boolean;
  handOut: boolean;
  surfing: boolean;
  boardTip: number;
}) {
  const happy =
    mood === "pointer" || (mood === "press" && handOut) || surfing;
  const focus = mood === "text" && !surfing;
  const hold = mood === "grab" && !surfing;
  const press = mood === "press";
  const wait = mood === "busy" && !surfing;
  const closed = blink && !press && !surfing;

  // Idle: centered on hotspot. With hand: shift up-left so hand takes the tip.
  const offset = handOut
    ? "absolute left-[-30px] top-[-54px]"
    : "absolute left-[-26px] top-[-28px]";

  const crouch = surfing ? 4 : 0;

  return (
    <div className={offset}>
      <svg
        width="52"
        height="52"
        viewBox="0 0 104 104"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-[0_8px_14px_rgba(244,114,182,0.32)]"
      >
        <ellipse
          cx="62"
          cy="86"
          rx="28"
          ry="7"
          fill="#1b1b27"
          transform={`rotate(${boardTip} 62 86)`}
        />
        <ellipse
          cx="62"
          cy="85"
          rx="25"
          ry="5"
          fill="url(#boardCute)"
          transform={`rotate(${boardTip} 62 86)`}
        />

        <circle
          cx="48"
          cy={52 + crouch}
          r={press ? 30 : surfing ? 27 : 28}
          fill="url(#bodyCute)"
        />
        <ellipse
          cx="44"
          cy={58 + crouch}
          rx="14"
          ry="15"
          fill="rgba(255,255,255,0.32)"
        />

        <ellipse
          cx="26"
          cy="30"
          rx="9"
          ry="12"
          fill="#f9a8d4"
          transform="rotate(-18 26 30)"
        />
        <ellipse
          cx="70"
          cy="30"
          rx="9"
          ry="12"
          fill="#f9a8d4"
          transform="rotate(18 70 30)"
        />
        <ellipse
          cx="26"
          cy="30"
          rx="4"
          ry="6"
          fill="#fda4d4"
          transform="rotate(-18 26 30)"
          opacity="0.7"
        />
        <ellipse
          cx="70"
          cy="30"
          rx="4"
          ry="6"
          fill="#fda4d4"
          transform="rotate(18 70 30)"
          opacity="0.7"
        />

        <ellipse cx="48" cy="28" rx="16" ry="12" fill="url(#hairCute)" />
        <ellipse cx="42" cy="26" rx="6" ry="4" fill="#fff" opacity="0.45" />

        {/* Soft brows — only lift when curious/happy, never angry */}
        {happy ? (
          <g
            stroke="#5b3a4a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          >
            <path d="M32 40c3-2.5 9-2.5 12 0" />
            <path d="M52 40c3-2.5 9-2.5 12 0" />
          </g>
        ) : focus ? (
          <g
            stroke="#5b3a4a"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          >
            <path d="M33 42c3-1 8-1 11 0" />
            <path d="M53 42c3-1 8-1 11 0" />
          </g>
        ) : null}

        <ellipse
          cx="30"
          cy="56"
          rx={happy || press ? 7 : 6}
          ry="3.5"
          fill="#fb7185"
          opacity={happy || press ? 0.8 : focus ? 0.35 : 0.45}
        />
        <ellipse
          cx="66"
          cy="56"
          rx={happy || press ? 7 : 6}
          ry="3.5"
          fill="#fb7185"
          opacity={happy || press ? 0.8 : focus ? 0.35 : 0.45}
        />

        {/* Eyes by mood */}
        {press ? (
          <g
            stroke="#5b3a4a"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M34 52c3 2.8 8 2.8 11 0" />
            <path d="M51 52c3 2.8 8 2.8 11 0" />
          </g>
        ) : closed ? (
          <g
            stroke="#5b3a4a"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M34 52c3 2.5 8 2.5 11 0" />
            <path d="M51 52c3 2.5 8 2.5 11 0" />
          </g>
        ) : focus ? (
          <g>
            <ellipse cx="39" cy="50" rx="5" ry="6.4" fill="#5b3a4a" />
            <ellipse cx="57" cy="50" rx="5" ry="6.4" fill="#5b3a4a" />
            <circle cx="40.5" cy="47.8" r="1.9" fill="#fff" />
            <circle cx="58.5" cy="47.8" r="1.9" fill="#fff" />
          </g>
        ) : hold ? (
          <g>
            {/* Determined but cute — slight squint */}
            <ellipse cx="39" cy="51" rx="6" ry="4.5" fill="#5b3a4a" />
            <ellipse cx="57" cy="51" rx="6" ry="4.5" fill="#5b3a4a" />
            <circle cx="40.8" cy="49.5" r="1.6" fill="#fff" />
            <circle cx="58.8" cy="49.5" r="1.6" fill="#fff" />
          </g>
        ) : wait ? (
          <g>
            <ellipse cx="39" cy="51.5" rx="5.5" ry="3.8" fill="#5b3a4a" />
            <ellipse cx="57" cy="51.5" rx="5.5" ry="3.8" fill="#5b3a4a" />
            <circle cx="40.5" cy="50.5" r="1.3" fill="#fff" />
            <circle cx="58.5" cy="50.5" r="1.3" fill="#fff" />
          </g>
        ) : (
          <g>
            <ellipse
              cx="39"
              cy={happy ? 49 : 50}
              rx={happy ? 6.4 : 5.5}
              ry={happy ? 7.2 : 6.2}
              fill="#5b3a4a"
            />
            <ellipse
              cx="57"
              cy={happy ? 49 : 50}
              rx={happy ? 6.4 : 5.5}
              ry={happy ? 7.2 : 6.2}
              fill="#5b3a4a"
            />
            <circle
              cx="41"
              cy={happy ? 46.8 : 48}
              r={happy ? 2.3 : 1.9}
              fill="#fff"
            />
            <circle
              cx="59"
              cy={happy ? 46.8 : 48}
              r={happy ? 2.3 : 1.9}
              fill="#fff"
            />
            <circle
              cx="37.4"
              cy={happy ? 52 : 53}
              r="1"
              fill="#fff"
              opacity="0.55"
            />
            <circle
              cx="55.4"
              cy={happy ? 52 : 53}
              r="1"
              fill="#fff"
              opacity="0.55"
            />
          </g>
        )}

        {/* Mouth by mood */}
        {press ? (
          <ellipse cx="48" cy="66" rx="5" ry="4" fill="#5b3a4a" />
        ) : happy ? (
          <path d="M39 61c3.5 7.5 14.5 7.5 18 0" fill="#5b3a4a" />
        ) : focus ? (
          <ellipse cx="48" cy="64" rx="3.2" ry="2.2" fill="#5b3a4a" />
        ) : hold ? (
          <path
            d="M40 63c3 4.5 13 4.5 16 0"
            stroke="#5b3a4a"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        ) : wait ? (
          <path
            d="M42 65c2.5 2 10.5 2 13 0"
            stroke="#5b3a4a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M42 63c2.5 3.2 11.5 3.2 14 0"
            stroke="#5b3a4a"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {happy ? (
          <path
            d="M78 34c0-2.2 1.8-3.5 3.5-3.5S85 31.8 85 34c0 3.5-3.5 6-3.5 6S78 37.5 78 34z"
            fill="#fda4d4"
          />
        ) : null}

        {focus ? (
          <g opacity="0.85">
            <rect x="78" y="40" width="2.2" height="14" rx="1.1" fill="#f472b6">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
        ) : null}

        {wait ? (
          <path
            d="M78 36c0 4 3.2 6 3.2 6s3.2-2 3.2-6c0-2.2-1.4-4-3.2-4S78 33.8 78 36z"
            fill="#7dd3fc"
            opacity="0.9"
          />
        ) : null}

        {/* Tiny tucked stub where hand will emerge from */}
        {handOut ? (
          <path
            d="M64 72c6 3 10 8 12 14"
            stroke="#f472b6"
            strokeWidth="7"
            strokeLinecap="round"
          />
        ) : null}

        <defs>
          <linearGradient id="bodyCute" x1="20" y1="24" x2="78" y2="84">
            <stop stopColor="#fecdd3" />
            <stop offset="0.45" stopColor="#f9a8d4" />
            <stop offset="1" stopColor="#e9d5ff" />
          </linearGradient>
          <linearGradient id="hairCute" x1="34" y1="18" x2="62" y2="40">
            <stop stopColor="#fdf2f8" />
            <stop offset="1" stopColor="#f0abfc" />
          </linearGradient>
          <linearGradient id="boardCute" x1="40" y1="80" x2="88" y2="92">
            <stop stopColor="#f9a8d4" />
            <stop offset="0.55" stopColor="#c4b5fd" />
            <stop offset="1" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function BuddyHand({
  mode,
  pressing,
}: {
  mode: "point" | "grab";
  pressing: boolean;
}) {
  return (
    <motion.div
      className="absolute left-0 top-0"
      initial={{ opacity: 0, scale: 0.4, x: -8, y: -22, rotate: -20 }}
      animate={{
        opacity: 1,
        scale: pressing ? 0.92 : 1,
        x: -16,
        y: pressing ? -14 : -18,
        rotate: mode === "grab" ? -4 : pressing ? 4 : 0,
      }}
      exit={{ opacity: 0, scale: 0.35, x: -6, y: -24, rotate: -24 }}
      transition={{ type: "spring", stiffness: 480, damping: 22, mass: 0.55 }}
    >
      <svg
        width="32"
        height="28"
        viewBox="0 0 32 28"
        className="overflow-visible drop-shadow-[0_4px_8px_rgba(244,114,182,0.28)]"
      >
        {mode === "grab" ? (
          /* Wide open paw — four toe beans, clearly a paw */
          <g>
            <ellipse cx="16" cy="16" rx="11" ry="9" fill="#f9a8d4" />
            <circle cx="7" cy="10" r="3.6" fill="#fda4d4" />
            <circle cx="13" cy="7.5" r="3.8" fill="#fda4d4" />
            <circle cx="19.5" cy="7.5" r="3.8" fill="#fda4d4" />
            <circle cx="25" cy="10" r="3.6" fill="#fda4d4" />
            <ellipse
              cx="16"
              cy="17"
              rx="5"
              ry="4"
              fill="rgba(255,255,255,0.42)"
            />
            {pressing ? (
              <ellipse
                cx="16"
                cy="18"
                rx="12"
                ry="8"
                fill="#f9a8d4"
                opacity="0.35"
              />
            ) : null}
          </g>
        ) : (
          /*
            Pointing mitt — short stubby fingers + clear thumb.
            Wide and flat on purpose so it never reads as a shaft.
          */
          <g>
            {/* Palm */}
            <ellipse cx="14" cy="15" rx="9" ry="8" fill="#f9a8d4" />
            {/* Thumb (side bump) */}
            <ellipse
              cx="5.5"
              cy="14"
              rx="4"
              ry="5"
              fill="#fda4d4"
              transform="rotate(-18 5.5 14)"
            />
            {/* Three short fingers along the top edge */}
            <circle cx="9" cy="7" r="3.3" fill="#fda4d4" />
            <circle cx="15" cy="5.5" r="3.5" fill="#fda4d4" />
            <circle cx="21" cy="7" r="3.3" fill="#fda4d4" />
            {/* Soft highlight on palm */}
            <ellipse
              cx="14"
              cy="16"
              rx="4.5"
              ry="3.5"
              fill="rgba(255,255,255,0.4)"
            />
            {/* Tiny tap spark near the contact edge */}
            {!pressing ? (
              <circle cx="26" cy="18" r="1.2" fill="#fff" opacity="0.85" />
            ) : null}
          </g>
        )}
      </svg>
    </motion.div>
  );
}
