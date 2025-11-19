import { useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { HowItWorks } from "@/components/HowItWorks";
import { Results } from "@/components/Results";
import { Differentials } from "@/components/Differentials";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "pt">("en");

  return (
    <div className="min-h-screen">
      {/* Language Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle language={language} onLanguageChange={setLanguage} />
      </div>

      {/* All Sections */}
      <Hero language={language} />
      <Problem language={language} />
      <Solution language={language} />
      <HowItWorks language={language} />
      <Results language={language} />
      <Differentials language={language} />
      <Testimonials language={language} />
      <CTA language={language} />
      <Footer language={language} />
    </div>
  );
};

export default Index;
