import { Waves } from "lucide-react";

interface FooterProps {
  language: "en" | "pt";
}

const content = {
  en: {
    tagline: "Revolutionizing naval efficiency with collaborative intelligence",
    rights: "All rights reserved.",
    contact: "Contact",
  },
  pt: {
    tagline: "Revolucionando a eficiência naval com inteligência colaborativa",
    rights: "Todos os direitos reservados.",
    contact: "Contato",
  },
};

export const Footer = ({ language }: FooterProps) => {
  const t = content[language];

  return (
    <footer className="py-12 bg-ocean-deep text-primary-foreground">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Waves className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold">TransWave</span>
          </div>
          <p className="text-center text-primary-foreground/80 max-w-md">
            {t.tagline}
          </p>
          <div className="border-t border-primary-foreground/20 pt-6 w-full text-center">
            <p className="text-sm text-primary-foreground/60">
              © 2024 TransWave. {t.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
