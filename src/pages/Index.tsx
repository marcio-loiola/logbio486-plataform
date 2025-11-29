import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { HowItWorks } from "@/components/HowItWorks";
import { Results } from "@/components/Results";
import { Differentials } from "@/components/Differentials";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Integration } from "@/components/Integration";
import { LandingHeader } from "@/components/LandingHeader";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "pt">("pt");

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      <LandingHeader language={language} onLanguageChange={setLanguage} />
      
      <main>
        <Hero language={language} />
        <Problem language={language} />
        <Results language={language} />
        <HowItWorks language={language} />
        <Differentials language={language} />
        <Integration language={language} />
        <Testimonials language={language} />
        <CTA language={language} />
      </main>

      <Footer language={language} />
    </div>
  );
};

export default Index;
