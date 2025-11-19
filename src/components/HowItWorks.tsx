import { Card, CardContent } from "@/components/ui/card";
import { Database, LineChart, Monitor, Bell, Route } from "lucide-react";

interface HowItWorksProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "How It Works",
    subtitle: "From Data to Action in 5 Steps",
    steps: [
      {
        icon: Database,
        title: "Data Collection & Modeling",
        description: "Gathering technical specifications, navigation routes, and environmental conditions from each vessel",
      },
      {
        icon: LineChart,
        title: "Predictive Analysis",
        description: "ML algorithms analyze biofouling impact on fuel consumption and emissions",
      },
      {
        icon: Monitor,
        title: "Interactive Dashboards",
        description: "Real-time visualization of fleet status, risk levels, and performance metrics",
      },
      {
        icon: Bell,
        title: "Dynamic Updates",
        description: "Continuous learning from new data to improve prediction accuracy",
      },
      {
        icon: Route,
        title: "Preventive Recommendations",
        description: "Actionable insights for route optimization and maintenance scheduling",
      },
    ],
  },
  pt: {
    title: "Como Funciona",
    subtitle: "De Dados a Ação em 5 Passos",
    steps: [
      {
        icon: Database,
        title: "Coleta e Modelagem de Dados",
        description: "Reunindo especificações técnicas, rotas de navegação e condições ambientais de cada embarcação",
      },
      {
        icon: LineChart,
        title: "Análise Preditiva",
        description: "Algoritmos de ML analisam impacto da bioincrustação no consumo de combustível e emissões",
      },
      {
        icon: Monitor,
        title: "Dashboards Interativos",
        description: "Visualização em tempo real do status da frota, níveis de risco e métricas de desempenho",
      },
      {
        icon: Bell,
        title: "Atualizações Dinâmicas",
        description: "Aprendizado contínuo com novos dados para melhorar a precisão das previsões",
      },
      {
        icon: Route,
        title: "Recomendações Preventivas",
        description: "Insights acionáveis para otimização de rotas e agendamento de manutenção",
      },
    ],
  },
};

export const HowItWorks = ({ language }: HowItWorksProps) => {
  const t = content[language];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-primary mb-6">{t.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          {t.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="border-border mb-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center border-2 border-secondary">
                          <Icon className="h-8 w-8 text-secondary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl font-bold text-secondary">
                            {index + 1}
                          </span>
                          <h3 className="text-xl font-semibold text-foreground">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < t.steps.length - 1 && (
                  <div className="flex justify-center mb-6">
                    <div className="w-0.5 h-8 bg-secondary/30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
