import { Waves, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FooterProps {
  language: "en" | "pt";
}

const content = {
  en: {
    tagline: "Revolutionizing naval efficiency with collaborative intelligence",
    rights: "All rights reserved.",
    contact: "Contact",
    links: ["Terms of Use", "Understand NORMAM 401", "Privacy Policy"],
    form: {
      title: "Get in Touch",
      name: "Name",
      company: "Company",
      fleet: "Fleet Size",
      submit: "Send Message",
      success: "Message sent successfully!",
    }
  },
  pt: {
    tagline: "Revolucionando a eficiência naval com inteligência colaborativa",
    rights: "Todos os direitos reservados.",
    contact: "Contato",
    links: ["Termos de Uso", "Entenda a NORMAM 401", "Política de Privacidade"],
    form: {
      title: "Fale Conosco",
      name: "Nome",
      company: "Empresa",
      fleet: "Tamanho da Frota",
      submit: "Enviar Mensagem",
      success: "Mensagem enviada com sucesso!",
    }
  },
};

export const Footer = ({ language }: FooterProps) => {
  const t = content[language];
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    toast({
      title: t.form.success,
      description: "We will contact you shortly.",
      className: "bg-[#006159] text-white border-none",
    });
  };

  return (
    <footer className="bg-[#454545] text-white pt-20 pb-10">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          
          {/* Brand & Links */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Waves className="h-8 w-8 text-[#FACC15]" />
              <span className="text-2xl font-bold">LogBio</span>
            </div>
            <p className="text-slate-300 max-w-md mb-8 leading-relaxed">
              {t.tagline}
            </p>
            
            <div className="flex flex-col gap-4">
              {t.links.map((link, i) => (
                <a key={i} href="#" className="text-slate-400 hover:text-[#FACC15] transition-colors w-fit">
                  {link}
                </a>
              ))}
              <a href="mailto:contato@logbio.com" className="text-slate-400 hover:text-[#FACC15] transition-colors w-fit flex items-center gap-2 mt-4">
                <Mail className="h-4 w-4" />
                contato@logbio.com
              </a>
            </div>
          </div>

          {/* Lead Form */}
          <div className="bg-[#525252] p-8 rounded-2xl border border-[#666666]">
            <h3 className="text-xl font-bold mb-6">{t.form.title}</h3>
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-64 text-center animate-in fade-in">
                <div className="w-16 h-16 bg-[#006159] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#006159] mb-2">{t.form.success}</h4>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder={t.form.name} 
                    className="bg-[#454545] border-[#666666] text-white placeholder:text-slate-400 focus-visible:ring-[#FACC15]"
                    required
                  />
                  <Input 
                    placeholder={t.form.company} 
                    className="bg-[#454545] border-[#666666] text-white placeholder:text-slate-400 focus-visible:ring-[#FACC15]"
                    required
                  />
                </div>
                <Input 
                  placeholder={t.form.fleet} 
                  className="bg-[#454545] border-[#666666] text-white placeholder:text-slate-400 focus-visible:ring-[#FACC15]"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-12 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : t.form.submit}
                  {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-[#666666] pt-8 text-center text-slate-400 text-sm">
          <p>© 2024 LogBio. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
};
