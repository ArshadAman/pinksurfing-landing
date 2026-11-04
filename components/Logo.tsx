import Image from "next/image";

type LogoProps = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
  priority?: boolean;
};

export function Logo({
  size = 36,
  showWordmark = true,
  className = "",
  wordmarkClassName = "",
  priority = false,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.jpeg"
        alt=""
        width={size}
        height={size}
        priority={priority}
        className="rounded-[22%] object-cover ring-1 ring-white/12"
        aria-hidden="true"
      />
      {showWordmark ? (
        <span
          className={`font-semibold tracking-tight text-ps-white ${wordmarkClassName}`}
        >
          PinkSurfing
        </span>
      ) : (
        <span className="sr-only">PinkSurfing</span>
      )}
    </span>
  );
}
