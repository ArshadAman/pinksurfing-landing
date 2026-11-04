import { URLS } from "@/lib/urls";

type GooglePlayBadgeProps = {
  className?: string;
  height?: number;
};

/** Official-style Google Play badge (SVG). Links to the live listing. */
export function GooglePlayBadge({
  className = "",
  height = 48,
}: GooglePlayBadgeProps) {
  const width = Math.round(height * (155 / 46));

  return (
    <a
      href={URLS.playStore}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex transition-opacity hover:opacity-90 focus-visible:opacity-100 ${className}`}
      aria-label="Get PinkSurfing on Google Play"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 155 46"
        width={width}
        height={height}
        role="img"
        aria-hidden="true"
      >
        <title>Get it on Google Play</title>
        <rect width="155" height="46" rx="6" fill="#000" />
        <rect
          x="0.5"
          y="0.5"
          width="154"
          height="45"
          rx="5.5"
          stroke="#a1a1a1"
          strokeWidth="1"
          fill="none"
        />
        <g transform="translate(10, 8)">
          <path
            d="M1.2 1.1c-.3.3-.5.8-.5 1.4v23c0 .6.2 1.1.5 1.4l.1.1 12.9-12.9v-.2L1.3 1z"
            fill="#00D2FF"
          />
          <path
            d="M19.6 18.7 15.2 14.3 1.3 28.2c.4.4 1 .5 1.6.2l16.7-9.7z"
            fill="#FF3A44"
          />
          <path
            d="M19.6 11.3 3 1.6C2.3 1.2 1.7 1.4 1.3 1.8l13.9 13.9 4.4-4.4z"
            fill="#FFD400"
          />
          <path
            d="m15.2 14.3 4.4 4.4 3.3-1.9c.9-.5.9-1.4 0-1.9l-3.3-1.9-4.4 1.3z"
            fill="#00F076"
          />
        </g>
        <g fill="#fff" fontFamily="Arial, Helvetica, sans-serif">
          <text x="42" y="17" fontSize="8" letterSpacing="0.4">
            GET IT ON
          </text>
          <text x="42" y="33" fontSize="15" fontWeight="700">
            Google Play
          </text>
        </g>
      </svg>
    </a>
  );
}
