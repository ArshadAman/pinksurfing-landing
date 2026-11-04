"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MockFrame, MockThumb } from "@/components/mocks/MockFrame";

function SalesChart({
  label,
  delta,
}: {
  label: string;
  delta: string;
}) {
  const reduce = useReducedMotion();
  /** Explicit px heights — % of auto parent collapses to empty. */
  const bars = [48, 72, 58, 96, 118, 104, 140];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-white/[0.08] bg-[#14151d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#8a8a8a]">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
            $18,240
          </p>
        </div>
        <span className="rounded-full bg-[rgba(46,204,113,0.12)] px-2.5 py-1 text-[11px] font-semibold text-[#2ecc71]">
          {delta}
        </span>
      </div>

      <div className="relative mt-auto flex h-[148px] items-end gap-2.5">
        {/* Baseline grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-5 top-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to top, transparent, transparent 35px, rgba(255,255,255,0.04) 36px)",
          }}
        />
        {bars.map((h, i) => (
          <div key={i} className="relative z-[1] flex flex-1 flex-col items-center gap-2">
            <motion.div
              className="w-full max-w-[28px] rounded-t-[6px] bg-gradient-to-t from-[#6f00ff] via-[#9747ff] to-[#f472b6] shadow-[0_0_20px_rgba(151,71,255,0.25)]"
              initial={reduce ? false : { height: 12 }}
              animate={{ height: h }}
              transition={{
                duration: 0.65,
                delay: 0.05 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={reduce ? { height: h } : undefined}
            />
            <span className="text-[9px] font-medium text-[#8a8a8a]">
              {days[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Premium marketplace UI chrome. */
export function MockShopUi({
  mode = "goods",
}: {
  mode?: "goods" | "places" | "vehicles";
}) {
  const listings =
    mode === "places"
      ? [
          { title: "SOHO loft · 2 bed", meta: "Residential", price: "$1.2M", tone: "violet" as const },
          { title: "Warehouse unit B", meta: "Commercial", price: "$840K", tone: "slate" as const },
          { title: "Harbor view condo", meta: "Residential", price: "$695K", tone: "pink" as const },
        ]
      : mode === "vehicles"
        ? [
            { title: "2022 F-150 XLT", meta: "Trucks", price: "$38,900", tone: "slate" as const },
            { title: "Operating café", meta: "Business", price: "$220K", tone: "violet" as const },
            { title: "Model Y Long Range", meta: "Cars", price: "$41,200", tone: "pink" as const },
          ]
        : [
            { title: "Studio mics · pair", meta: "Electronics", price: "$240", tone: "violet" as const },
            { title: "Brand photoshoot", meta: "GigHub", price: "$180/hr", tone: "pink" as const },
            { title: "Portable SSD 2TB", meta: "Electronics", price: "$159", tone: "slate" as const },
          ];

  const tabs =
    mode === "places"
      ? ["Real estate", "Commercial", "Saved"]
      : mode === "vehicles"
        ? ["Vehicles", "Businesses", "Saved"]
        : ["For you", "GigHub", "Electronics"];

  return (
    <MockFrame domain="shop.pinksurfing.com" title="Marketplace" badge="Browse">
      <div className="flex gap-2 overflow-x-auto px-4 py-3.5 sm:px-5">
        {tabs.map((tab, i) => (
          <span
            key={tab}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-wide ${
              i === 0
                ? "bg-gradient-to-r from-[#f472b6] to-[#9747ff] text-white shadow-[0_8px_24px_rgba(236,72,153,0.25)]"
                : "border border-white/10 bg-white/[0.03] text-[#b4b4b4]"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      <ul className="flex-1 space-y-2.5 px-4 pb-5 sm:px-5">
        {listings.map((item, i) => (
          <li
            key={item.title}
            className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#16171f] p-3 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          >
            <MockThumb tone={item.tone} label={String(i + 1).padStart(2, "0")} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold tracking-tight text-white">
                {item.title}
              </span>
              <span className="mt-0.5 block text-[11px] text-[#8a8a8a]">
                {item.meta}
              </span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-[#f472b6]">
              {item.price}
            </span>
          </li>
        ))}
      </ul>
    </MockFrame>
  );
}

/** Premium vendor dashboard — real chart, clear hierarchy. */
export function MockVendorUi({
  mode = "overview",
}: {
  mode?: "overview" | "listings" | "storefront" | "payouts";
}) {
  const title =
    mode === "overview"
      ? "Seller dashboard"
      : mode === "listings"
        ? "Your listings"
        : mode === "storefront"
          ? "Storefront"
          : "Payouts";

  return (
    <MockFrame
      domain="vendors.pinksurfing.com"
      title={title}
      badge={mode === "payouts" ? "US only" : "Live"}
    >
      {mode === "overview" || mode === "payouts" ? (
        <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Orders", value: "128", hint: "This week" },
              { label: "Views", value: "4.2k", hint: "Storefront" },
              {
                label: mode === "payouts" ? "Payout" : "GMV",
                value: mode === "payouts" ? "$6.4k" : "$18.2k",
                hint: mode === "payouts" ? "Ready" : "Gross",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.08] bg-[#16171f] px-3 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
                  {stat.label}
                </p>
                <p className="mt-1.5 text-xl font-semibold tracking-tight text-white tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] text-[#8a8a8a]">{stat.hint}</p>
              </div>
            ))}
          </div>

          <SalesChart
            label={mode === "payouts" ? "Payout trend · US" : "Sales this week"}
            delta="+18%"
          />

          {mode === "payouts" ? (
            <p className="text-[11px] leading-relaxed text-[#8a8a8a]">
              Payouts available in the United States only · Powered by Square
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === "listings" ? (
        <ul className="flex-1 space-y-2.5 p-4 sm:p-5">
          {[
            { title: "Ceramic lamp set", status: "Active", stock: "12", tone: "pink" as const },
            { title: "Desk chair · oak", status: "Active", stock: "4", tone: "violet" as const },
            { title: "Studio package", status: "Draft", stock: "—", tone: "slate" as const },
          ].map((row) => (
            <li
              key={row.title}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#16171f] px-3 py-3"
            >
              <MockThumb tone={row.tone} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">
                  {row.title}
                </span>
                <span className="mt-0.5 block text-[11px] text-[#8a8a8a]">
                  Stock {row.stock}
                </span>
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  row.status === "Active"
                    ? "bg-[rgba(46,204,113,0.14)] text-[#2ecc71]"
                    : "bg-white/[0.06] text-[#b4b4b4]"
                }`}
              >
                {row.status}
              </span>
            </li>
          ))}
          <li className="rounded-2xl border border-dashed border-[#f472b6]/35 bg-[rgba(236,72,153,0.06)] px-3.5 py-4 text-center text-sm font-semibold text-[#f472b6]">
            + Add listing
          </li>
        </ul>
      ) : null}

      {mode === "storefront" ? (
        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#16171f] p-4">
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-[#9747ff]/15 via-transparent to-[#ec4899]/10"
            />
            <div className="relative">
              <p className="text-[11px] text-[#8a8a8a]">Store name</p>
              <p className="mt-1 text-xl font-semibold tracking-tight text-white">
                Northwind Goods
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#b4b4b4]">
                Curated home & studio products for PinkSurfing shoppers.
              </p>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-2.5">
            {[
              { label: "Featured", tone: "from-[#3a1d4a] to-[#191924]" },
              { label: "New", tone: "from-[#4a1d38] to-[#191924]" },
              { label: "Best sellers", tone: "from-[#1d2a4a] to-[#191924]" },
              { label: "Archive", tone: "from-[#1b1b27] to-[#14151d]" },
            ].map((cell) => (
              <div
                key={cell.label}
                className={`flex min-h-[88px] items-end rounded-2xl border border-white/[0.08] bg-gradient-to-br ${cell.tone} p-3.5`}
              >
                <span className="text-xs font-semibold text-white/80">
                  {cell.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </MockFrame>
  );
}
