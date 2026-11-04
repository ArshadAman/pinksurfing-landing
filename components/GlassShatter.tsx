"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  generateShatterShards,
  HANDOFF,
  SHATTER_IMPACT,
  SHATTER_TIMELINE,
  type ShatterShard,
} from "@/lib/shatter";

type Phase = "idle" | "playing" | "assembling" | "done";

type Props = {
  captureRef: React.RefObject<HTMLElement | null>;
  /** Increment to fire forward shatter (each value plays once). */
  playKey: number;
  /** Increment to reverse-assemble shards → intact. */
  assembleKey: number;
  className?: string;
  /** Shards are on screen — safe to hide intact glass / start revealing Why. */
  onPlayingChange?: (playing: boolean) => void;
  onShatterComplete?: () => void;
  onAssembleComplete?: () => void;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number) {
  return t * t * t;
}

function snapshotGlass(el: HTMLElement): {
  html: string;
  w: number;
  h: number;
} {
  const rect = el.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-cursor-ref]").forEach((n) => {
    n.removeAttribute("data-cursor-ref");
  });
  clone.querySelectorAll("*").forEach((node) => {
    const n = node as HTMLElement;
    if (!n.style) return;
    n.style.transform = "none";
    n.style.translate = "none";
    n.style.rotate = "none";
    n.style.scale = "none";
  });
  clone.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:${h}px;opacity:1;visibility:visible;transform:none;pointer-events:none;margin:0;background-color:#0e0f13;overflow:hidden;`;
  clone.removeAttribute("data-hero-glass");
  return { html: clone.outerHTML, w, h };
}

function ShardPiece({
  shard,
  snapshotHtml,
  localT,
  size,
  reverse,
}: {
  shard: ShatterShard;
  snapshotHtml: string | null;
  localT: number;
  size: { w: number; h: number };
  reverse: boolean;
}) {
  const { crackEnd, flyEnd } = SHATTER_TIMELINE;
  const crackT = Math.min(1, localT / Math.max(crackEnd, 0.001));
  const flySpan = flyEnd - crackEnd;
  const rawFly = localT <= crackEnd ? 0 : (localT - crackEnd) / flySpan;
  const delay = reverse ? 0 : shard.delay;
  const eased = reverse ? easeInCubic : easeOutCubic;
  const flyT = eased(
    Math.min(1, Math.max(0, (rawFly - delay) / Math.max(1 - delay, 0.001))),
  );

  const crackLift = reverse ? 0 : crackT * 1.5;
  const x = shard.dx * flyT;
  const y = shard.dy * flyT - crackLift;
  const rotate = shard.rotate * flyT;
  // Forward: fade out as shards leave. Reverse: stay solid while converging.
  const opacity = reverse
    ? 1
    : flyT <= 0.35
      ? 1
      : Math.max(0, 1 - (flyT - 0.35) / 0.65);
  const scale = 1 - flyT * 0.08;

  return (
    <div
      aria-hidden
      data-shard={shard.id}
      className="absolute inset-0 overflow-hidden will-change-transform"
      style={{
        clipPath: shard.clipPath,
        WebkitClipPath: shard.clipPath,
        transformOrigin: `${shard.cx}% ${shard.cy}%`,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
        opacity,
      }}
    >
      {snapshotHtml ? (
        <div
          className="pointer-events-none absolute left-0 top-0"
          style={{ width: size.w, height: size.h }}
          dangerouslySetInnerHTML={{ __html: snapshotHtml }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/hero-atmosphere.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
          }}
        />
      )}
    </div>
  );
}

/**
 * Timed glass shatter + reverse assemble.
 * playKey / assembleKey are monotonic counters so the effect can replay.
 */
export function GlassShatter({
  captureRef,
  playKey,
  assembleKey,
  className = "",
  onPlayingChange,
  onShatterComplete,
  onAssembleComplete,
}: Props) {
  const reduce = useReducedMotion();
  const shards = useMemo(
    () => generateShatterShards(14, SHATTER_IMPACT, 42),
    [],
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const [snapshotHtml, setSnapshotHtml] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [localT, setLocalT] = useState(0);
  const snapRef = useRef<string | null>(null);
  const raf = useRef(0);
  const lastPlayKey = useRef(0);
  const lastAssembleKey = useRef(0);
  const onPlayingChangeRef = useRef(onPlayingChange);
  const onShatterCompleteRef = useRef(onShatterComplete);
  const onAssembleCompleteRef = useRef(onAssembleComplete);
  onPlayingChangeRef.current = onPlayingChange;
  onShatterCompleteRef.current = onShatterComplete;
  onAssembleCompleteRef.current = onAssembleComplete;

  const takeSnapshot = () => {
    const el = captureRef.current;
    if (!el) return false;
    // Force visible for capture even if Hero already started hiding.
    const prev = {
      opacity: el.style.opacity,
      visibility: el.style.visibility,
    };
    el.style.opacity = "1";
    el.style.visibility = "visible";
    const snap = snapshotGlass(el);
    el.style.opacity = prev.opacity;
    el.style.visibility = prev.visibility;
    snapRef.current = snap.html;
    setSnapshotHtml(snap.html);
    setSize({ w: snap.w, h: snap.h });
    return true;
  };

  // Forward shatter
  useEffect(() => {
    if (reduce || playKey <= 0 || playKey === lastPlayKey.current) return;
    lastPlayKey.current = playKey;
    cancelAnimationFrame(raf.current);

    takeSnapshot();
    setLocalT(0);
    setPhase("playing");
    // Next frame: shards painted, then tell Hero to hide intact glass.
    requestAnimationFrame(() => {
      onPlayingChangeRef.current?.(true);
    });

    const duration = HANDOFF.shatterMs;
    const t0 = performance.now();
    let cancelled = false;

    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - t0) / duration);
      setLocalT(t);
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setPhase("done");
        onPlayingChangeRef.current?.(false);
        onShatterCompleteRef.current?.();
      }
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey, reduce, captureRef]);

  // Reverse assemble
  useEffect(() => {
    if (reduce || assembleKey <= 0 || assembleKey === lastAssembleKey.current)
      return;
    lastAssembleKey.current = assembleKey;
    cancelAnimationFrame(raf.current);

    // Reuse last snapshot or capture. Start mid-flight so shards still cover
    // the pin (starting at t=1 would leave Why flashing through empty space).
    if (!snapRef.current) takeSnapshot();
    const startT = 0.5;
    setLocalT(startT);
    setPhase("assembling");
    onPlayingChangeRef.current?.(true);

    const duration = HANDOFF.assembleMs;
    const t0 = performance.now();
    let cancelled = false;

    const tick = (now: number) => {
      if (cancelled) return;
      const p = Math.min(1, (now - t0) / duration);
      const t = startT * (1 - p);
      setLocalT(t);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setPhase("idle");
        setLocalT(0);
        // Clear snapshot so next forward play re-captures current glass.
        snapRef.current = null;
        setSnapshotHtml(null);
        onPlayingChangeRef.current?.(false);
        onAssembleCompleteRef.current?.();
      }
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assembleKey, reduce, captureRef]);

  if (reduce) return null;
  if (phase !== "playing" && phase !== "assembling") return null;

  return (
    <div
      data-shatter-layer
      data-shatter-phase={phase}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 40 }}
      aria-hidden
    >
      {phase === "playing" && localT < 0.18 ? (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0.45 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(circle at 50% 44%, rgba(255,255,255,0.5) 0%, rgba(255,200,220,0.16) 28%, transparent 62%)",
          }}
        />
      ) : null}

      {phase === "playing" && localT < SHATTER_TIMELINE.crackEnd + 0.05 ? (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ opacity: Math.max(0, 1 - localT / 0.24) }}
        >
          {shards.slice(0, 9).map((s) => (
            <line
              key={`c-${s.id}`}
              x1={SHATTER_IMPACT.x}
              y1={SHATTER_IMPACT.y}
              x2={s.cx}
              y2={s.cy}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={0.16}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      ) : null}

      {shards.map((shard) => (
        <ShardPiece
          key={shard.id}
          shard={shard}
          snapshotHtml={snapshotHtml}
          localT={localT}
          size={size}
          reverse={phase === "assembling"}
        />
      ))}
    </div>
  );
}

export type { ShatterShard };
