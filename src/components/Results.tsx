import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, CheckCircle, Leaf, DollarSign } from "lucide-react";

interface ResultsProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "Expected Results",
    subtitle: "Measurable Impact on Operations",
    metrics: [
      {
        icon: TrendingDown,
        value: "12%",
        label: "Reduction in fuel consumption",
        description: "Lower operational costs and environmental impact",
      },
      {
        icon: CheckCircle,
        value: "100%",
        label: "NORMAM 401 compliance",
        description: "Full regulatory compliance and risk mitigation",
      },
      {
        icon: Leaf,
        value: "CO2",
        label: "Decarbonization support",
        description: "Contribute to sustainability and emission reduction goals",
      },
      {
        icon: DollarSign,
        value: "$$$",
        label: "Maintenance savings",
        description: "Optimized maintenance schedules reduce costs significantly",
      },
    ],
  },
  pt: {
    title: "Resultados Esperados",
    subtitle: "Impacto Mensurável nas Operações",
    metrics: [
      {
        icon: TrendingDown,
        value: "12%",
        label: "Redução no consumo de combustível",
        description: "Menores custos operacionais e impacto ambiental",
      },
      {
        icon: CheckCircle,
        value: "100%",
        label: "Conformidade NORMAM 401",
        description: "Conformidade regulatória total e mitigação de riscos",
      },
      {
        icon: Leaf,
        value: "CO2",
        label: "Apoio à descarbonização",
        description: "Contribua para metas de sustentabilidade e redução de emissões",
      },
      {
        icon: DollarSign,
        value: "$$$",
        label: "Economia em manutenção",
        description: "Cronogramas de manutenção otimizados reduzem custos significativamente",
      },
    ],
  },
};

export const Results = ({ language }: ResultsProps) => {
  const t = content[language];

  return (
    <section className="py-20 bg-gradient-to-br from-ocean-deep to-ocean-medium text-primary-foreground">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-secondary">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {t.metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-background/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <div className="text-4xl font-bold text-secondary mb-2">
                    {metric.value}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {metric.label}
                  </h3>
                  <p className="text-sm text-primary-foreground/80">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
