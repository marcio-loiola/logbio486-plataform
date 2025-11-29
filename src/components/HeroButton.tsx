import { Link } from 'react-router-dom';
import { Button } from './ui/button';

interface HeroButtonProps {
  language: 'en' | 'pt';
}

export default function HeroButton({ language }: HeroButtonProps) {
  const content = {
    en: 'Get Started',
    pt: 'Começar',
  };

  return (
    <Link to="/auth">
      <Button variant="hero" size="lg" className="text-lg">
        {content[language]}
      </Button>
    </Link>
  );
}
