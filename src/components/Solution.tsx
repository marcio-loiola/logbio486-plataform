import { Card, CardContent } from "@/components/ui/card";
import { Network, Database, Brain, Ship } from "lucide-react";

interface SolutionProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "Our Solution",
    subtitle: "The Waze for Transpetro's Fleet",
    description:
      "TransWave is a collaborative web platform where each vessel becomes an intelligent instance with real technical and environmental data. By integrating simulated IoT sensors and machine learning algorithms, we monitor, predict, and optimize routes and maintenance in real-time.",
    features: [
      {
        icon: Network,
        title: "Collaborative Network",
        description: "Each ship contributes data to improve predictions across the entire fleet",
      },
      {
        icon: Database,
        title: "Real-Time Data Integration",
        description: "Environmental conditions, navigation data, and vessel performance in one platform",
      },
      {
        icon: Brain,
        title: "Machine Learning Algorithms",
        description: "Advanced predictive models that learn from fleet behavior patterns",
      },
      {
        icon: Ship,
        title: "Biofouling Prediction",
        description: "Anticipate buildup before it becomes a problem, optimizing maintenance schedules",
      },
    ],
  },
  pt: {
    title: "Nossa Solução",
    subtitle: "O Waze da Frota Transpetro",
    description:
      "TransWave é uma plataforma web colaborativa onde cada embarcação se torna uma instância inteligente com dados técnicos e ambientais reais. Ao integrar sensores IoT simulados e algoritmos de machine learning, monitoramos, prevemos e otimizamos rotas e manutenções em tempo real.",
    features: [
      {
        icon: Network,
        title: "Rede Colaborativa",
        description: "Cada navio contribui com dados para melhorar previsões em toda a frota",
      },
      {
        icon: Database,
        title: "Integração de Dados em Tempo Real",
        description: "Condições ambientais, dados de navegação e desempenho das embarcações em uma plataforma",
      },
      {
        icon: Brain,
        title: "Algoritmos de Machine Learning",
        description: "Modelos preditivos avançados que aprendem com padrões de comportamento da frota",
      },
      {
        icon: Ship,
        title: "Previsão de Bioincrustação",
        description: "Antecipe acúmulos antes que se tornem um problema, otimizando cronogramas de manutenção",
      },
    ],
  },
};

export const Solution = ({ language }: SolutionProps) => {
  const t = content[language];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-secondary mb-6">{t.subtitle}</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border hover:border-secondary transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
