import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { URLS } from "@/lib/urls";

export const metadata: Metadata = {
  title: "About",
  description:
    "About PinkSurfing — a social business hub with App, Shop, and Vendors. Payments powered by Square. Mountain View, CA.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main" className="ps-section pt-28">
        <div className="ps-container max-w-3xl">
          <p className="ps-eyebrow">Company</p>
          <h1 className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-ps-white sm:text-4xl md:text-5xl">
            About PinkSurfing
          </h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-ps-muted">
            <p>
              PinkSurfing is a social business hub for people who chat, buy, and
              sell. We offer three products under one brand: the App at{" "}
              <a href={URLS.app} className="text-ps-pink-soft underline-offset-2 hover:underline">
                app.pinksurfing.com
              </a>
              , the Shop at{" "}
              <a href={URLS.shop} className="text-ps-pink-soft underline-offset-2 hover:underline">
                shop.pinksurfing.com
              </a>
              , and Vendors at{" "}
              <a href={URLS.vendors} className="text-ps-pink-soft underline-offset-2 hover:underline">
                vendors.pinksurfing.com
              </a>
              .
            </p>
            <p>
              Payments are powered by Square. Receiving PayChat and vendor
              payouts are available in the United States only at this time.
            </p>
            <p>
              Android is on Google Play; iOS is coming soon. The web app is
              available now.
            </p>
            <p>
              <strong className="font-semibold text-ps-white">Contact:</strong>{" "}
              <a
                href={URLS.contactEmail}
                className="text-ps-pink-soft underline-offset-2 hover:underline"
              >
                marketing@pinksurfing.com
              </a>
            </p>
            <p>
              <strong className="font-semibold text-ps-white">Address:</strong>{" "}
              800 W El Camino Real Ste 180, Mountain View, CA 94040-2586, United
              States
            </p>
          </div>
          <p className="mt-10">
            <Link
              href="/"
              className="text-sm font-semibold text-ps-white underline-offset-2 hover:underline"
            >
              ← Back to PinkSurfing
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
