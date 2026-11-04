import { Logo } from "@/components/Logo";
import { GooglePlayBadge } from "@/components/GooglePlayBadge";
import { SquareLogo } from "@/components/SquareLogo";
import { URLS } from "@/lib/urls";

const productLinks = [
  { href: URLS.app, label: "App" },
  { href: URLS.shop, label: "Shop" },
  { href: URLS.vendors, label: "Vendors" },
  { href: URLS.playStore, label: "Google Play", external: true },
] as const;

const companyLinks = [
  { href: "/about", label: "About" },
  { href: URLS.privacy, label: "Privacy policy", external: true },
  { href: "/privacy", label: "Privacy summary" },
  { href: URLS.contactEmail, label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#0a0b0f] pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-12 sm:pt-14">
      <div className="ps-container">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo size={34} wordmarkClassName="text-lg" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ps-muted">
              Social business hub — App, Shop, and Vendors under one brand.
            </p>
            <div className="mt-5">
              <GooglePlayBadge height={40} />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-ps-dim">
              Products
            </h2>
            <ul className="mt-3 space-y-0.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-ps-muted transition-colors hover:text-ps-white"
                    {...("external" in link && link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-ps-dim">
              Company
            </h2>
            <ul className="mt-3 space-y-0.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-ps-muted transition-colors hover:text-ps-white"
                    {...("external" in link && link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ps-divider mt-10" />

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ps-dim">
            © {new Date().getFullYear()} PinkSurfing. All rights reserved.
          </p>
          <div className="flex flex-col gap-2 sm:items-end">
            <SquareLogo poweredBy height={20} />
            <p className="text-xs text-ps-dim">
              PayChat receiving &amp; vendor payouts: US only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
