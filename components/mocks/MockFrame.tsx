import type { ReactNode } from "react";

/** Shared product-chrome frame — consistent hierarchy across all mocks. */
export function MockFrame({
  domain,
  title,
  badge,
  children,
  className = "",
  /** Hide traffic lights when nested inside a phone bezel */
  bare = false,
}: {
  domain: string;
  title: string;
  badge?: string;
  children: ReactNode;
  className?: string;
  bare?: boolean;
}) {
  return (
    <div
      className={`relative flex h-full min-h-[280px] min-w-0 flex-col overflow-hidden bg-[#0c0d12] sm:min-h-[380px] md:min-h-[440px] ${className}`}
    >
      {/* Top chrome */}
      <div className="relative z-10 flex min-w-0 items-center gap-2 border-b border-white/[0.07] bg-[#12131a]/90 px-3 py-2.5 backdrop-blur-sm sm:gap-3 sm:px-5 sm:py-3">
        {!bare ? (
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/90" />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f472b6]">
            {domain}
          </p>
          <p className="truncate text-sm font-semibold tracking-tight text-white">
            {title}
          </p>
        </div>
        {badge ? (
          <span className="shrink-0 rounded-full bg-gradient-to-r from-[#f472b6]/25 to-[#9747ff]/25 px-2.5 py-1 text-[10px] font-semibold text-[#f472b6] ring-1 ring-[#f472b6]/25">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>

      {/* Soft brand wash — keep inset so overflow:hidden actually contains them */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(151,71,255,0.16),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-6 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.1),transparent_70%)]"
      />
    </div>
  );
}

export function MockThumb({
  tone = "pink",
  label,
  size = "md",
}: {
  tone?: "pink" | "violet" | "slate";
  label?: string;
  size?: "sm" | "md";
}) {
  const tones = {
    pink: "from-[#4a1d38] via-[#ec4899]/35 to-[#9747ff]/25",
    violet: "from-[#2a1a4a] via-[#9747ff]/40 to-[#f472b6]/20",
    slate: "from-[#1b1b27] via-[#2a2a3a] to-[#191924]",
  };
  const box = size === "sm" ? "h-11 w-11" : "h-14 w-14";

  return (
    <span
      className={`relative flex ${box} shrink-0 items-end overflow-hidden rounded-xl bg-gradient-to-br ${tones[tone]} p-2 ring-1 ring-white/10`}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
        }}
      />
      {label ? (
        <span className="relative text-[9px] font-bold tracking-wide text-white/85">
          {label}
        </span>
      ) : null}
    </span>
  );
}
