import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AppSection } from "@/components/AppSection";
import { ShopSection } from "@/components/ShopSection";
import { VendorsSection } from "@/components/VendorsSection";
import { FaqSection } from "@/components/FaqSection";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        {/* Hero sticky pin includes Why under-layer; #app continues below. */}
        <Hero />
        <AppSection />
        <ShopSection />
        <VendorsSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
