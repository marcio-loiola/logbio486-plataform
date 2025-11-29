import { Button } from "@/components/ui/button";
import { ArrowRight, Waves } from "lucide-react";
import heroShip from "@/assets/hero-ship.jpg";
import HeroButton from "./HeroButton";

interface HeroProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "TransWave",
    subtitle: "Revolutionizing naval efficiency with collaborative intelligence",
    description:
      "A collaborative platform that integrates real-time data and intelligent algorithms to reduce consumption, emissions, and ensure compliance with NORMAM 401.",
    cta: "See Demo",
    secondary: "Learn More",
  },
  pt: {
    title: "TransWave",
    subtitle: "Revolucionando a eficiência naval com inteligência colaborativa",
    description:
      "Plataforma colaborativa que integra dados em tempo real e algoritmos inteligentes para reduzir consumo, emissões e garantir conformidade com a NORMAM 401.",
    cta: "Ver Demo",
    secondary: "Saiba Mais",
  },
};

export const Hero = ({ language }: HeroProps) => {
  const t = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroShip})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep/95 via-ocean-medium/90 to-ocean-light/85" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Waves className="h-12 w-12 text-secondary" />
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground">
              {t.title}
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-semibold text-secondary mb-6">
            {t.subtitle}
          </h2>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 leading-relaxed">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HeroButton language={language} />
            <Button variant="outline" size="lg" className="text-lg bg-background/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/20">
              {t.secondary}
            </Button>
          </div>
        </div>
      </div>

      {/* Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          className="w-full h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};
