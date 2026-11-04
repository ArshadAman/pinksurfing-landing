import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { URLS } from "@/lib/urls";
import { faqs } from "@/lib/faqs";
import { SkipLink } from "@/components/SkipLink";
import { SurfBuddyCursor } from "@/components/SurfBuddyCursor";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const title = "PinkSurfing — Chat, Shop & Sell";
const description =
  "PinkSurfing is a social business hub: messaging and PayChat in the app, a multi-vendor marketplace at shop.pinksurfing.com, and a vendor dashboard at vendors.pinksurfing.com. Payments are powered by Square. Receiving PayChat and vendor payouts are US only. Android on Google Play; iOS coming soon.";

export const metadata: Metadata = {
  metadataBase: new URL(URLS.site),
  title: {
    default: title,
    template: "%s | PinkSurfing",
  },
  description,
  applicationName: "PinkSurfing",
  keywords: [
    "PinkSurfing",
    "PayChat",
    "Square",
    "marketplace",
    "vendor dashboard",
    "social business app",
    "multi-vendor shop",
    "GigHub",
  ],
  icons: {
    icon: [{ url: "/logo.jpeg" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.jpeg" }],
  },
  authors: [{ name: "PinkSurfing" }],
  creator: "PinkSurfing",
  publisher: "PinkSurfing",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: URLS.site,
    siteName: "PinkSurfing",
    title,
    description,
    // Image from app/opengraph-image.tsx (file convention) — avoid logo.jpeg override
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: "#0e0f13",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PinkSurfing",
  url: URLS.site,
  logo: `${URLS.site}/logo.jpeg`,
  email: "marketing@pinksurfing.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "800 W El Camino Real Ste 180",
    addressLocality: "Mountain View",
    addressRegion: "CA",
    postalCode: "94040-2586",
    addressCountry: "US",
  },
  sameAs: [URLS.app, URLS.shop, URLS.vendors, URLS.playStore],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PinkSurfing",
  url: URLS.site,
  description,
  publisher: {
    "@type": "Organization",
    name: "PinkSurfing",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PinkSurfing",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Android, Web",
  url: URLS.app,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  downloadUrl: URLS.playStore,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <SkipLink />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
        {children}
        <SurfBuddyCursor />
      </body>
    </html>
  );
}
