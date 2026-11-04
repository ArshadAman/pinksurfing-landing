/** Shatter geometry + handoff timing for Hero → Why. */

export type ShatterPoint = { x: number; y: number };

export type ShatterShard = {
  id: number;
  clipPath: string;
  /** Percent origin for transform */
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  rotate: number;
  /** 0–1 stagger within the fly phase */
  delay: number;
};

/**
 * Scroll progress on sticky track ["start start","end end"].
 * Scrub runs until TRIGGER, then a **timed** shatter plays (not scroll-scrubbed),
 * then WHY_HOLD occupies the rest of the pin.
 */
export const HANDOFF = {
  /** Parallax scrub ends / shatter may start */
  trigger: 0.48,
  /**
   * Scroll back below this to reverse-assemble into intact glass.
   * Kept well under trigger so a tiny scroll-up doesn't bounce the effect.
   */
  assembleBelow: 0.32,
  /** Timed shatter duration (wall clock) — readable even after a fast flick */
  shatterMs: 1700,
  /** Reverse assemble is snappier than the break */
  assembleMs: 900,
  track: {
    desktop: "380svh",
    mobile: "320svh",
  },
} as const;

/** Local 0→1 timeline inside the timed shatter play */
export const SHATTER_TIMELINE = {
  /** Intact still; prepare */
  hold: 0,
  /** Cracks / shards visible in place */
  crackEnd: 0.2,
  /** Shards finished flying */
  flyEnd: 1,
} as const;

export const SHATTER_IMPACT = { x: 50, y: 44 } as const;

export const SCRUB_SPRING = {
  stiffness: 70,
  damping: 24,
  mass: 0.85,
  restDelta: 0.001,
  restSpeed: 0.001,
} as const;

/** Mobile / reduced-motion dissolve (no shatter). */
export const FADE = {
  start: 0.42,
  mid: 0.55,
  end: 0.7,
} as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function dist(a: ShatterPoint, b: ShatterPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function centroid(pts: ShatterPoint[]): ShatterPoint {
  let x = 0;
  let y = 0;
  for (const p of pts) {
    x += p.x;
    y += p.y;
  }
  const n = pts.length || 1;
  return { x: x / n, y: y / n };
}

function polyPath(pts: ShatterPoint[]) {
  return `polygon(${pts.map((p) => `${p.x.toFixed(2)}% ${p.y.toFixed(2)}%`).join(", ")})`;
}

/** Voronoi-ish radial shards from impact — 18–24 pieces for a readable break. */
export function generateShatterShards(
  count = 20,
  impact: ShatterPoint = SHATTER_IMPACT,
  seed = 42,
): ShatterShard[] {
  const rand = seeded(seed);
  const target = clamp(Math.round(count), 12, 26);
  const wedges = Math.max(6, Math.ceil(target / 2));
  const { x: ix, y: iy } = impact;

  const angles: number[] = [];
  let a = rand() * Math.PI * 2;
  for (let i = 0; i < wedges; i++) {
    angles.push(a);
    a += (Math.PI * 2) / wedges + (rand() - 0.5) * 0.28;
  }
  angles.sort((u, v) => u - v);

  const edgePoint = (angle: number): ShatterPoint => {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const tx = c > 0 ? (100 - ix) / c : c < 0 ? -ix / c : Infinity;
    const ty = s > 0 ? (100 - iy) / s : s < 0 ? -iy / s : Infinity;
    const t = Math.min(tx, ty) * (0.94 + rand() * 0.1);
    return {
      x: clamp(ix + c * t, -1, 101),
      y: clamp(iy + s * t, -1, 101),
    };
  };

  const shards: ShatterShard[] = [];

  for (let i = 0; i < wedges; i++) {
    const a0 = angles[i]!;
    const a1 = angles[(i + 1) % wedges]!;
    const p0 = edgePoint(a0);
    const p1 = edgePoint(a1);
    const split = 0.36 + rand() * 0.2;
    const inner0 = {
      x: ix + (p0.x - ix) * split + (rand() - 0.5) * 3,
      y: iy + (p0.y - iy) * split + (rand() - 0.5) * 3,
    };
    const inner1 = {
      x: ix + (p1.x - ix) * split + (rand() - 0.5) * 3,
      y: iy + (p1.y - iy) * split + (rand() - 0.5) * 3,
    };
    const midOuter = {
      x: (p0.x + p1.x) / 2 + (rand() - 0.5) * 5,
      y: (p0.y + p1.y) / 2 + (rand() - 0.5) * 5,
    };

    const rings: ShatterPoint[][] = [
      [
        { x: ix, y: iy },
        inner0,
        inner1,
      ],
      [inner0, p0, midOuter, p1, inner1],
    ];

    for (let r = 0; r < rings.length; r++) {
      if (shards.length >= target) break;
      const pts = rings[r]!;
      const c = centroid(pts);
      const d = dist(c, impact) || 1;
      const ux = (c.x - ix) / d;
      const uy = (c.y - iy) / d;
      // Fling far enough that shards leave the viewport and Why reads clearly.
      const fling = r === 0 ? 0.9 + rand() * 0.35 : 1.15 + rand() * 0.45;

      shards.push({
        id: shards.length,
        clipPath: polyPath(pts),
        cx: c.x,
        cy: c.y,
        dx: ux * fling * (220 + rand() * 180),
        dy: uy * fling * (180 + rand() * 160) + (80 + rand() * 120),
        rotate: (rand() - 0.5) * (r === 0 ? 28 : 48),
        delay: clamp(d / 200 + rand() * 0.03, 0, 0.12),
      });
    }
    if (shards.length >= target) break;
  }

  return shards;
}
