import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  language: "en" | "pt";
  onLanguageChange: (lang: "en" | "pt") => void;
}

export const LanguageToggle = ({ language, onLanguageChange }: LanguageToggleProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onLanguageChange(language === "en" ? "pt" : "en")}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === "en" ? "PT" : "EN"}
    </Button>
  );
};
