import { Navbar } from "@/sections/Navbar";
import { Hero } from "@/sections/Hero";
import { TrustStrip } from "@/sections/TrustStrip";
import { HowItWorks } from "@/sections/HowItWorks";
import { HandlerSection } from "@/sections/HandlerSection";
import { AccountControl } from "@/sections/AccountControl";
import { PrivacySection } from "@/sections/PrivacySection";
import { WhyAITraining } from "@/sections/WhyAITraining";
import { Earnings } from "@/sections/Earnings";
import { Testimonials } from "@/sections/Testimonials";
import { FAQ } from "@/sections/FAQ";
import { FinalCTA } from "@/sections/FinalCTA";
import { Footer } from "@/sections/Footer";
import { ActivityToast } from "@/components/ActivityToast";
import { WelcomeGate } from "@/components/WelcomeGate";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <HandlerSection />
        <AccountControl />
        <PrivacySection />
        <WhyAITraining />
        <Earnings />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <ActivityToast />
      <WelcomeGate />
    </div>
  );
}
