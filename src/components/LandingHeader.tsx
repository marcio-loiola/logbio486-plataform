import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Menu, X, Anchor } from 'lucide-react';
import { cn } from "@/lib/utils";
import logoLogBio from '@/assets/logoLogBio.png';
import logoLogBioVerde from '@/assets/logoLogBioVerde.png';

interface LandingHeaderProps {
  language: "en" | "pt";
  onLanguageChange: (lang: "en" | "pt") => void;
}

export const LandingHeader = ({ language, onLanguageChange }: LandingHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: language === 'en' ? 'Solution' : 'Solução', href: '#solution' },
    { name: language === 'en' ? 'How it Works' : 'Como Funciona', href: '#how-it-works' },
    { name: language === 'en' ? 'Market' : 'Mercado', href: '#market' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src={isScrolled ? logoLogBioVerde : logoLogBio} 
            alt="LogBio" 
            className="h-16 w-auto transition-opacity duration-300" 
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-sm font-medium hover:text-[#2563EB] transition-colors",
                isScrolled ? "text-slate-600" : "text-white/90"
              )}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageToggle language={language} onLanguageChange={onLanguageChange} variant={isScrolled ? "default" : "light"} />
          <Link to="/auth">
            <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium px-6">
              {language === 'en' ? 'Crew Access' : 'Acesso à Tripulação'}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={cn("h-6 w-6", isScrolled ? "text-[#003950]" : "text-white")} />
          ) : (
            <Menu className={cn("h-6 w-6", isScrolled ? "text-[#003950]" : "text-white")} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 md:hidden flex flex-col gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-slate-600 font-medium py-2 border-b border-slate-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-2">
            <LanguageToggle language={language} onLanguageChange={onLanguageChange} variant="default" />
            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                {language === 'en' ? 'Crew Access' : 'Acesso à Tripulação'}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
