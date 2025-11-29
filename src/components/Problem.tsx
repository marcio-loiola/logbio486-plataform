import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Scale, Eye, DollarSign } from "lucide-react";

interface ProblemProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "The Problem",
    subtitle: "The Hidden Cost Sinking Efficiency",
    description:
      "Biofouling is the silent enemy of maritime operations. It creates drag, increases fuel consumption, and poses severe environmental risks.",
    costLabel: "Annual Global Cost",
    costValue: "$30 Billion",
    items: [
      {
        icon: TrendingUp,
        title: "Wasted Fuel",
        description: "Up to 40% higher fuel consumption due to increased drag resistance",
      },
      {
        icon: AlertTriangle,
        title: "Silent Impact",
        description: "Significant increase in CO2 and pollutant emissions",
      },
    ],
  },
  pt: {
    title: "O Problema",
    subtitle: "O Custo Oculto que Afunda a Eficiência",
    description:
      "A bioincrustação é o inimigo silencioso das operações marítimas. Ela cria arrasto, aumenta o consumo de combustível e impõe riscos ambientais severos.",
    costLabel: "Custo Global Anual",
    costValue: "US$ 30 Bilhões",
    items: [
      {
        icon: TrendingUp,
        title: "Combustível Desperdiçado",
        description: "Até 40% mais consumo de combustível devido ao aumento da resistência ao arrasto",
      },
      {
        icon: AlertTriangle,
        title: "Impacto Silencioso",
        description: "Aumento significativo nas emissões de CO2 e poluentes",
      },
    ],
  },
};

export const Problem = ({ language }: ProblemProps) => {
  const t = content[language];

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="lg:w-1/2">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-[#006159] uppercase bg-[#006159]/10 rounded-full">
              {t.title}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              {t.subtitle}
            </h2>
            <p className="text-lg text-[#475569] mb-8 leading-relaxed">
              {t.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {t.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0F172A] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#475569]">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Graphic / Data */}
          <div className="lg:w-1/2 w-full">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl transform rotate-2"></div>
              <Card className="relative border-none shadow-2xl bg-white overflow-hidden">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <DollarSign className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-[#475569] mb-2 uppercase tracking-wide">
                    {t.costLabel}
                  </h3>
                  <div className="text-5xl md:text-7xl font-black text-red-600 tracking-tighter mb-6">
                    {t.costValue}
                  </div>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">
                    *Estimativa de perdas diretas e indiretas no setor marítimo global.
                  </p>
                </CardContent>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-tr-full -ml-12 -mb-12 opacity-50"></div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
