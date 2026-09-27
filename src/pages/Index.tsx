import { motion, useScroll, useSpring } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/sections/Hero";
import { HowItWorks } from "@/sections/HowItWorks";
import { Features } from "@/sections/Features";
import { BeforeAfter } from "@/sections/BeforeAfter";
import { UploadDemo } from "@/sections/UploadDemo";
import { UseCases } from "@/sections/UseCases";
import { Pricing } from "@/sections/Pricing";
import { SocialProof } from "@/sections/SocialProof";
import { FinalCta } from "@/sections/FinalCta";
import { Footer } from "@/sections/Footer";

export default function Index() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-primary"
      />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <BeforeAfter />
        <UploadDemo />
        <UseCases />
        <Pricing />
        <SocialProof />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
