type SquareLogoProps = {
  className?: string;
  /** Wordmark height; mark scales with it */
  height?: number;
  /** Show “Powered by” above the mark */
  poweredBy?: boolean;
  /** Link to Square (default true) */
  link?: boolean;
};

/**
 * Square mark + wordmark for dark UI.
 * Use next to payment copy — keep clear space; don’t recolor or stretch.
 */
export function SquareLogo({
  className = "",
  height = 28,
  poweredBy = false,
  link = true,
}: SquareLogoProps) {
  const mark = Math.round(height * 0.92);
  const content = (
    <span
      className={`inline-flex flex-col gap-1.5 ${className}`}
      aria-label={poweredBy ? "Powered by Square" : "Square"}
    >
      {poweredBy ? (
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ps-dim">
          Powered by
        </span>
      ) : null}
      <span className="inline-flex items-center gap-2">
        {/* Square symbol — rounded square mark */}
        <svg
          width={mark}
          height={mark}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Classic Square mark: rounded outer with inner cutout */}
          <path
            fill="#FFFFFF"
            fillRule="evenodd"
            d="M6 0h20a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6Zm3.5 9.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-9Z"
            clipRule="evenodd"
          />
        </svg>
        <svg
          height={height}
          viewBox="0 0 120 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-auto"
        >
          {/* Geometric “Square” wordmark approximation for dark backgrounds */}
          <text
            x="0"
            y="22"
            fill="#FFFFFF"
            fontFamily="system-ui, -apple-system, Segoe UI, Arial, sans-serif"
            fontSize="22"
            fontWeight="700"
            letterSpacing="-0.02em"
          >
            Square
          </text>
        </svg>
      </span>
    </span>
  );

  if (!link) return content;

  return (
    <a
      href="https://squareup.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center transition-opacity hover:opacity-90 focus-visible:opacity-100"
    >
      {content}
    </a>
  );
}

/** Compact inline note: Square mark + short payment line */
export function PoweredBySquare({
  className = "",
  note,
}: {
  className?: string;
  note?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}
    >
      <SquareLogo poweredBy height={22} />
      {note ? (
        <p className="text-sm leading-relaxed text-ps-dim">{note}</p>
      ) : null}
    </div>
  );
}
