import { Card, CardContent } from "@/components/ui/card";
import { Network, Zap, TrendingUp, Target } from "lucide-react";

interface DifferentialsProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "Our Differentials",
    subtitle: "What Makes TransWave Unique",
    items: [
      {
        icon: Network,
        title: "Unique Collaborative Network",
        description: "The only platform that transforms fleet data into collective intelligence, where each vessel contributes to improve predictions for all",
      },
      {
        icon: Zap,
        title: "All-in-One Platform",
        description: "Prediction and optimization in a single interface - no need for multiple tools or complex integrations",
      },
      {
        icon: TrendingUp,
        title: "Continuous Learning",
        description: "Machine learning models that evolve with fleet data, becoming more accurate over time",
      },
      {
        icon: Target,
        title: "Transpetro-Focused",
        description: "Designed specifically for Transpetro's operational context and regulatory requirements",
      },
    ],
  },
  pt: {
    title: "Nossos Diferenciais",
    subtitle: "O Que Torna TransWave Única",
    items: [
      {
        icon: Network,
        title: "Rede Colaborativa Única",
        description: "A única plataforma que transforma dados da frota em inteligência coletiva, onde cada embarcação contribui para melhorar previsões para todos",
      },
      {
        icon: Zap,
        title: "Plataforma Tudo-em-Um",
        description: "Previsão e otimização em uma única interface - sem necessidade de múltiplas ferramentas ou integrações complexas",
      },
      {
        icon: TrendingUp,
        title: "Aprendizado Contínuo",
        description: "Modelos de machine learning que evoluem com os dados da frota, tornando-se mais precisos ao longo do tempo",
      },
      {
        icon: Target,
        title: "Foco na Transpetro",
        description: "Projetado especificamente para o contexto operacional e requisitos regulatórios da Transpetro",
      },
    ],
  },
};

export const Differentials = ({ language }: DifferentialsProps) => {
  const t = content[language];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-primary">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {t.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="border-border hover:shadow-xl transition-all duration-300 hover:border-secondary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                      <Icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
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
