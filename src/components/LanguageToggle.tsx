import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  language: "en" | "pt";
  onLanguageChange: (lang: "en" | "pt") => void;
  variant?: "default" | "light";
}

export const LanguageToggle = ({ language, onLanguageChange, variant = "default" }: LanguageToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onLanguageChange(language === "en" ? "pt" : "en")}
      className={cn(
        "flex items-center gap-2",
        variant === "light" 
          ? "text-white hover:bg-white/10 hover:text-white border-white/30" 
          : "text-slate-600 hover:bg-slate-100 border-slate-200"
      )}
    >
      <Globe className="h-4 w-4" />
      {language === "en" ? "PT" : "EN"}
    </Button>
  );
};
