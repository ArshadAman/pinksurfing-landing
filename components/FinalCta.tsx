"use client";

import { Reveal } from "@/components/Reveal";
import { GooglePlayBadge } from "@/components/GooglePlayBadge";
import { IconArrow } from "@/components/Icons";
import { URLS } from "@/lib/urls";

export function FinalCta() {
  return (
    <section
      id="get-started"
      className="relative overflow-hidden border-t border-white/8"
      aria-labelledby="cta-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(151,71,255,0.14),transparent_55%),linear-gradient(180deg,#0e0f13_0%,#12121c_100%)]"
      />

      <div className="ps-container relative py-[clamp(4.5rem,10vw,7rem)] text-center">
        <Reveal className="mx-auto max-w-2xl">
          <h2
            id="cta-heading"
            className="text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-ps-white sm:text-4xl md:text-[2.75rem]"
          >
            Open PinkSurfing.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-ps-muted sm:text-lg">
            Start in the app, browse the shop, or log into Vendors.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a href={URLS.app} className="ps-btn-primary w-full sm:w-auto">
              Open App
              <IconArrow />
            </a>
            <a href={URLS.shop} className="ps-btn-secondary w-full sm:w-auto">
              Shop
            </a>
            <a href={URLS.vendors} className="ps-btn-secondary w-full sm:w-auto">
              Vendors
            </a>
          </div>

          <div className="mt-10 flex justify-center">
            <GooglePlayBadge height={44} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
