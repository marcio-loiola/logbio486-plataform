import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonialsProps {
  language: "en" | "pt";
}

const content = {
  en: {
    title: "What People Are Saying",
    testimonials: [
      {
        quote: "TransWave has the potential to revolutionize how we approach fleet maintenance. The predictive capabilities could save us millions in operational costs.",
        author: "João Silva",
        role: "Fleet Operations Manager",
      },
      {
        quote: "Finally, a solution that addresses both efficiency and environmental compliance. The collaborative approach is exactly what the maritime industry needs.",
        author: "Maria Santos",
        role: "Sustainability Director",
      },
      {
        quote: "The integration of real-time data with machine learning is impressive. This could be a game-changer for the entire Transpetro fleet.",
        author: "Carlos Oliveira",
        role: "Technology Innovation Lead",
      },
    ],
  },
  pt: {
    title: "O Que Dizem Sobre Nós",
    testimonials: [
      {
        quote: "TransWave tem o potencial de revolucionar como abordamos a manutenção da frota. As capacidades preditivas podem nos economizar milhões em custos operacionais.",
        author: "João Silva",
        role: "Gerente de Operações de Frota",
      },
      {
        quote: "Finalmente, uma solução que aborda tanto eficiência quanto conformidade ambiental. A abordagem colaborativa é exatamente o que a indústria marítima precisa.",
        author: "Maria Santos",
        role: "Diretora de Sustentabilidade",
      },
      {
        quote: "A integração de dados em tempo real com machine learning é impressionante. Isso pode mudar o jogo para toda a frota da Transpetro.",
        author: "Carlos Oliveira",
        role: "Líder de Inovação Tecnológica",
      },
    ],
  },
};

export const Testimonials = ({ language }: TestimonialsProps) => {
  const t = content[language];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-12">
          {t.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {t.testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-secondary mb-4" />
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
