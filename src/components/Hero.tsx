import { Button } from "@/components/ui/button";
import { ArrowRight, Waves, TrendingUp } from "lucide-react";
import heroShip from "@/assets/hero-ship.jpg";
import { Link } from "react-router-dom";

interface HeroProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "Optimize Your Fleet. Protect the Planet.",
    subtitle: "Reduce operational costs and emissions with Machine Learning applied to biofouling management.",
    cta: "Request Demo",
    secondary: "See Financial Impact",
    ticker: "Market projected to reach $7.85 Billion by 2032",
  },
  pt: {
    title: "Otimize sua Frota. Proteja o Planeta.",
    subtitle: "Reduza custos operacionais e emissões com Machine Learning aplicado ao gerenciamento de bioincrustação.",
    cta: "Solicitar Demonstração",
    secondary: "Ver Impacto Financeiro",
    ticker: "Mercado projetado de US$ 7.85 Bilhões até 2032",
  },
};

export const Hero = ({ language }: HeroProps) => {
  const t = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#003950]">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroShip})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#003950]/90 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 mx-auto mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="flex items-center justify-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <div className="bg-[#006159]/20 p-3 rounded-full backdrop-blur-sm border border-[#006159]/30">
              <Waves className="h-8 w-8 text-[#006159]" />
            </div>
          </div>
          
          <h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards"
          >
            {t.title}
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed max-w-3xl mx-auto font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards"
          >
            {t.subtitle}
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards"
          >
            <Button size="lg" className="text-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 h-12 shadow-lg hover:shadow-blue-500/25 transition-all">
              {t.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg border-[#003950] bg-white text-[#003950] hover:bg-slate-50 px-8 h-12">
              {t.secondary}
            </Button>
          </div>

          {/* Ticker / Social Proof */}
          <div 
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 animate-in fade-in duration-1000 delay-700 fill-mode-backwards"
          >
            <TrendingUp className="h-4 w-4 text-[#FACC15]" />
            <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">
              {t.ticker}
            </span>
          </div>
        </div>
      </div>

      {/* Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          className="w-full h-24 md:h-32"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
};
