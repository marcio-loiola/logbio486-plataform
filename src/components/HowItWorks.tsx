import { Card, CardContent } from "@/components/ui/card";
import { Database, Brain, Zap } from "lucide-react";

interface HowItWorksProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "The Solution",
    subtitle: "How TransWave Works",
    steps: [
      {
        icon: Database,
        title: "Continuous Monitoring",
        description: "Real-time operational and environmental data collection from every vessel.",
      },
      {
        icon: Brain,
        title: "Predictive Prediction",
        description: "Algorithms identify growth patterns before the human eye can see.",
      },
      {
        icon: Zap,
        title: "Optimization",
        description: "Precise alerts on the ideal cleaning moment to maximize efficiency.",
      },
    ],
  },
  pt: {
    title: "A Solução",
    subtitle: "Como a TransWave Funciona",
    steps: [
      {
        icon: Database,
        title: "Monitoramento Contínuo",
        description: "Dados operacionais e ambientais em tempo real de cada embarcação.",
      },
      {
        icon: Brain,
        title: "Previsão Preditiva",
        description: "Algoritmos identificam padrões de crescimento antes que o olho humano veja.",
      },
      {
        icon: Zap,
        title: "Otimização",
        description: "Alertas precisos sobre o momento ideal de limpeza para maximizar eficiência.",
      },
    ],
  },
};

export const HowItWorks = ({ language }: HowItWorksProps) => {
  const t = content[language];

  return (
    <section id="solution" className="py-24 bg-slate-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-[#003950] uppercase bg-[#003950]/5 rounded-full">
            {t.subtitle}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            {t.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {t.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white group overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#003950] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#475569] leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
                <div className="h-1 w-full bg-gradient-to-r from-[#003950] to-[#006159] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
