"use client";

import { Reveal } from "@/components/Reveal";
import { PoweredBySquare } from "@/components/SquareLogo";
import { MockVendorUi } from "@/components/mocks/CommerceMocks";
import { IconArrow, IconStore } from "@/components/Icons";
import { URLS } from "@/lib/urls";

const steps = [
  {
    title: "Create your vendor account",
    body: "Sign in at vendors.pinksurfing.com — the seller portal, separate from the buyer shop.",
  },
  {
    title: "List what you sell",
    body: "Add products or listings for PinkSurfing marketplace shoppers across goods and bigger-ticket categories.",
  },
  {
    title: "Manage the storefront",
    body: "Keep listings current and handle the seller side of marketplace commerce from one dashboard.",
  },
  {
    title: "Get paid in the US",
    body: "Vendor payouts are available in the United States only. Payments are powered by Square.",
  },
] as const;

export function VendorsSection() {
  return (
    <section
      id="vendors"
      className="ps-section bg-ps-surf/25 pt-0"
      aria-labelledby="vendors-heading"
    >
      <div className="ps-divider" />
      <div className="ps-container pt-[clamp(4.5rem,10vw,7.5rem)]">
        <Reveal className="max-w-3xl">
          <p className="ps-eyebrow">
            <IconStore className="h-4 w-4" />
            Vendors · vendors.pinksurfing.com
          </p>
              <h2
                id="vendors-heading"
                className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-ps-white sm:text-4xl md:text-[2.75rem] md:leading-[1.15]"
              >
            Sell on the PinkSurfing marketplace.
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ps-muted sm:text-lg">
            List inventory, run your storefront, and get paid in the US — from
            vendors.pinksurfing.com.
          </p>
        </Reveal>

        <div className="mt-14 grid min-w-0 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="min-w-0 border-t border-white/10 py-8 first:border-t-0 first:pt-0"
              >
                <p className="font-mono text-sm text-ps-pink-soft">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-balance text-xl font-semibold tracking-tight text-ps-white sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-lg text-pretty text-base leading-relaxed text-ps-muted">
                  {step.body}
                </p>
              </article>
            ))}

            <div className="ps-note mt-2" role="note">
              <p className="text-sm font-semibold text-ps-pink-soft">
                Payouts: United States only
              </p>
              <PoweredBySquare className="mt-3" />
            </div>

            <a href={URLS.vendors} className="ps-btn-primary mt-8 w-full sm:w-auto">
              <span className="lg:hidden">Vendor login</span>
              <span className="hidden lg:inline">Log in at vendors.pinksurfing.com</span>
              <IconArrow />
            </a>
          </div>

          <div className="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/8 bg-ps-card lg:sticky lg:top-28">
            <MockVendorUi mode="overview" />
          </div>
        </div>
      </div>
    </section>
  );
}
