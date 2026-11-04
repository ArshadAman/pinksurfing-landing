/**
 * Why PinkSurfing content — rendered as the under-layer inside the Hero sticky pin.
 * No separate document section / sticky track (avoids “section scroll” feel).
 * No decorative MockChatUi portal at any breakpoint.
 */

const frictions = [
  {
    title: "Chat in one place. Pay in another.",
    body: "Deals stall when conversation and payment live in different apps.",
  },
  {
    title: "Buying and selling feel disconnected.",
    body: "Shoppers browse one world. Sellers run another. The relationship gets lost.",
  },
  {
    title: "Follow-ups fall through.",
    body: "Calls, contracts, and next steps never sit beside the same thread.",
  },
] as const;

export function WhyContent() {
  return (
    <div className="ps-container w-full py-10 sm:py-12 lg:py-8">
      <div className="max-w-3xl">
        <p className="ps-eyebrow">Why PinkSurfing</p>
        <h2
          id="why-heading"
          className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-ps-white sm:text-4xl md:text-[2.75rem] md:leading-[1.15]"
        >
          Business still happens across too many tabs.
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ps-muted sm:text-lg">
          PinkSurfing keeps messaging, marketplace buying, and selling under one
          brand — so you spend less time switching tools.
        </p>
      </div>

      <div className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-10">
        {frictions.map((item, i) => (
          <article
            key={item.title}
            className="min-w-0 border-t border-white/12 pt-6"
          >
            <p className="font-mono text-xs text-ps-pink-soft">0{i + 1}</p>
            <h3 className="mt-2 text-balance text-xl font-semibold tracking-tight text-ps-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ps-muted sm:text-base">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-base leading-relaxed text-ps-muted sm:mt-12 sm:text-lg lg:mt-14">
        Next: how the{" "}
        <a
          href="#app"
          className="inline-flex min-h-11 items-center font-semibold text-ps-pink-soft underline-offset-4 hover:underline"
        >
          App
        </a>
        ,{" "}
        <a
          href="#shop"
          className="inline-flex min-h-11 items-center font-semibold text-ps-pink-soft underline-offset-4 hover:underline"
        >
          Shop
        </a>
        , and{" "}
        <a
          href="#vendors"
          className="inline-flex min-h-11 items-center font-semibold text-ps-pink-soft underline-offset-4 hover:underline"
        >
          Vendors
        </a>{" "}
        portal each work.
      </p>
    </div>
  );
}
