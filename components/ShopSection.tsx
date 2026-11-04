"use client";

import { Reveal } from "@/components/Reveal";
import { MockShopUi } from "@/components/mocks/CommerceMocks";
import { IconArrow, IconShop } from "@/components/Icons";
import { URLS } from "@/lib/urls";

const categories = [
  {
    name: "Business for sale",
    detail: "Operating businesses and opportunities listed by sellers.",
  },
  {
    name: "Residential real estate",
    detail: "Homes and residential listings inside the marketplace.",
  },
  {
    name: "Commercial real estate",
    detail: "Commercial property beyond residential stock.",
  },
  {
    name: "Cars & trucks",
    detail: "Vehicles listed by marketplace vendors.",
  },
  {
    name: "Electronics & goods",
    detail: "Everyday products — from electronics to specialty categories.",
  },
  {
    name: "GigHub hiring",
    detail: "Hire for services and gigs alongside product shopping.",
  },
] as const;

export function ShopSection() {
  return (
    <section id="shop" className="ps-section pt-0" aria-labelledby="shop-heading">
      <div className="ps-divider" />
      <div className="ps-container pt-[clamp(4.5rem,10vw,7.5rem)]">
        <div className="grid min-w-0 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 min-w-0 overflow-hidden rounded-[1.75rem] border border-white/8 bg-ps-card lg:order-1 lg:sticky lg:top-28">
            <MockShopUi mode="goods" />
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <Reveal>
              <p className="ps-eyebrow">
                <IconShop className="h-4 w-4" />
                Shop · shop.pinksurfing.com
              </p>
              <h2
                id="shop-heading"
                className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-ps-white sm:text-4xl md:text-[2.75rem] md:leading-[1.15]"
              >
                A marketplace for products, places, businesses, and gigs.
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ps-muted sm:text-lg">
                Search and checkout across everyday goods and bigger-ticket
                categories — all on shop.pinksurfing.com.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {categories.map((category) => (
                <article
                  key={category.name}
                  className="min-w-0 border-t border-white/10 pt-5"
                >
                  <h3 className="text-balance text-lg font-semibold text-ps-white">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ps-muted">
                    {category.detail}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 sm:mt-12">
              <a href={URLS.shop} className="ps-btn-primary w-full sm:w-auto">
                <span className="lg:hidden">Browse the shop</span>
                <span className="hidden lg:inline">Browse shop.pinksurfing.com</span>
                <IconArrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
