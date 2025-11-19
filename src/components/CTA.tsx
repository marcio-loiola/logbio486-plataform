import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";

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
    <section className="py-20 bg-gradient-to-br from-ocean-light to-teal-bright text-primary-foreground">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <Rocket className="h-16 w-16 mx-auto mb-6 text-accent" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.title}
          </h2>
          <p className="text-xl mb-10">
            {t.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg">
              {t.primaryCTA}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg bg-background/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
            >
              {t.secondaryCTA}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
