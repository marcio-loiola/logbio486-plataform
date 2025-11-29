import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

interface CTAProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "Ready to Transform Your Fleet Operations?",
    description: "Join us in revolutionizing maritime efficiency with intelligent, collaborative technology.",
    primaryCTA: "See Demo",
    secondaryCTA: "Join Hackathon",
  },
  pt: {
    title: "Pronto para Transformar as Operações da Sua Frota?",
    description: "Junte-se a nós para revolucionar a eficiência marítima com tecnologia inteligente e colaborativa.",
    primaryCTA: "Ver Demo",
    secondaryCTA: "Participar do Hackathon",
  },
};

export const CTA = ({ language }: CTAProps) => {
  const t = content[language];

  return (
    <section className="py-20 bg-[#003950] text-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <Rocket className="h-16 w-16 mx-auto mb-6 text-[#FACC15]" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.title}
          </h2>
          <p className="text-xl mb-10 text-slate-200">
            {t.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 h-12 shadow-lg hover:shadow-blue-500/25 transition-all">
                {t.primaryCTA}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg bg-transparent border-white/30 text-white hover:bg-white/10 px-8 h-12"
            >
              {t.secondaryCTA}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
