import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { URLS } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy summary for PinkSurfing. Read the full privacy policy for complete terms.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main" className="ps-section pt-28">
        <div className="ps-container max-w-3xl">
          <p className="ps-eyebrow">Legal</p>
          <h1 className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-ps-white sm:text-4xl">
            Privacy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ps-muted">
            PinkSurfing provides messaging, calling, marketplace commerce, vendor
            tools, and related services. How we handle account data, payments,
            and platform activity is described in our full privacy policy.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ps-muted">
            This page is a short landing summary only. For the complete legal
            text, open the canonical policy:
          </p>
          <a
            href={URLS.privacy}
            className="ps-btn-primary mt-8 w-full sm:w-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read full privacy policy
          </a>
          <p className="mt-8 text-sm text-ps-dim">
            Questions:{" "}
            <a
              href={URLS.contactEmail}
              className="text-ps-purple-light underline-offset-2 hover:underline"
            >
              marketing@pinksurfing.com
            </a>
          </p>
          <p className="mt-6">
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
