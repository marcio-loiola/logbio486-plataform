import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Scale, Eye } from "lucide-react";

interface ProblemProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "The Problem",
    subtitle: "Understanding Biofouling Impact",
    description:
      "Biofouling is the accumulation of microorganisms, plants, algae, and animals on ship hulls. This seemingly minor issue creates massive operational challenges:",
    items: [
      {
        icon: TrendingUp,
        title: "Increased Fuel Consumption",
        description: "Up to 40% higher fuel consumption due to increased drag resistance",
      },
      {
        icon: AlertTriangle,
        title: "Higher Emissions",
        description: "Significant increase in CO2 and pollutant emissions, impacting sustainability goals",
      },
      {
        icon: Scale,
        title: "Regulatory Risk",
        description: "Non-compliance with NORMAM 401 can result in penalties and operational restrictions",
      },
      {
        icon: Eye,
        title: "Visual Inspection Limitations",
        description: "Traditional inspections are costly, time-consuming, and often miss critical early-stage buildup",
      },
    ],
  },
  pt: {
    title: "O Problema",
    subtitle: "Entendendo o Impacto da Bioincrustação",
    description:
      "Bioincrustação é o acúmulo de microorganismos, plantas, algas e animais nos cascos dos navios. Este problema aparentemente menor cria desafios operacionais massivos:",
    items: [
      {
        icon: TrendingUp,
        title: "Aumento do Consumo de Combustível",
        description: "Até 40% mais consumo de combustível devido ao aumento da resistência ao arrasto",
      },
      {
        icon: AlertTriangle,
        title: "Emissões Elevadas",
        description: "Aumento significativo nas emissões de CO2 e poluentes, impactando metas de sustentabilidade",
      },
      {
        icon: Scale,
        title: "Risco Regulatório",
        description: "Não conformidade com a NORMAM 401 pode resultar em penalidades e restrições operacionais",
      },
      {
        icon: Eye,
        title: "Limitações da Inspeção Visual",
        description: "Inspeções tradicionais são custosas, demoradas e frequentemente perdem acúmulos críticos em estágio inicial",
      },
    ],
  },
};

export const Problem = ({ language }: ProblemProps) => {
  const t = content[language];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-primary mb-6">{t.subtitle}</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {t.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
