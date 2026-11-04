"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { IconClose, IconMenu } from "@/components/Icons";
import { URLS } from "@/lib/urls";
import { motionTokens } from "@/lib/motion";

const nav = [
  { href: "#why", label: "Why" },
  { href: "#app", label: "App" },
  { href: "#shop", label: "Shop" },
  { href: "#vendors", label: "Sell" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background,border-color,backdrop-filter,box-shadow] duration-200 ${
        scrolled || open
          ? "border-b border-white/10 bg-[#0e0f13]/92 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="ps-container flex h-14 items-center gap-3 md:h-16 md:gap-4">
        <a
          href="#top"
          className="relative z-10 inline-flex min-h-11 min-w-11 shrink-0 items-center"
          aria-label="PinkSurfing home"
        >
          <Logo
            size={28}
            priority
            /* Icon-only at top so hero brand isn’t doubled; wordmark after scroll */
            showWordmark={scrolled || open}
            wordmarkClassName="text-sm font-semibold tracking-tight text-ps-white"
          />
        </a>

        <nav
          className="ml-auto hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-ps-muted transition-colors hover:text-ps-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-2">
          {/* Wrapper owns visibility — .ps-btn-* sets display:inline-flex and overrides Tailwind `hidden` */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={URLS.shop}
              className="ps-btn-secondary !min-h-10 !px-4 !text-sm"
            >
              Shop
            </a>
            <a
              href={URLS.app}
              className="ps-btn-primary !min-h-10 !px-4 !text-sm"
            >
              Open App
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-ps-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="border-t border-white/8 bg-[#0e0f13]/98 backdrop-blur-xl lg:hidden"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{
              duration: motionTokens.duration.fast,
              ease: motionTokens.easing.standard,
            }}
          >
            <nav
              className="ps-container flex max-h-[min(70svh,24rem)] flex-col gap-0.5 overflow-y-auto overscroll-contain py-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
              aria-label="Mobile"
            >
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-3.5 text-base font-medium text-ps-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-white/8 pt-4">
                <a href={URLS.app} className="ps-btn-primary w-full">
                  Open App
                </a>
                <a href={URLS.shop} className="ps-btn-secondary w-full">
                  Shop marketplace
                </a>
                <a href={URLS.vendors} className="ps-btn-secondary w-full">
                  Sell as a vendor
                </a>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
