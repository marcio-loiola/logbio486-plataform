import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import heroShip from '@/assets/hero-ship.jpg';
import { Ship } from 'lucide-react';

const emailSchema = z.string().email('Invalid email address'); // Keeping email validation for now as Supabase expects email
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For this demo/hackathon, we might want to relax email validation if the user enters a simple ID
    // But Supabase requires email. So we assume they enter an email.
    // If we want to support "CPF/Matrícula", we'd need a mapping or backend logic, 
    // but for the UI we'll label it "CPF/Matrícula" and expect an email for the actual auth call.
    
    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);
    
    if (!emailValidation.success) {
      toast({ title: 'Error', description: 'Por favor, insira um email válido.', variant: 'destructive' });
      return;
    }
    
    if (!passwordValidation.success) {
      toast({ title: 'Error', description: 'A senha deve ter pelo menos 6 caracteres.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({ title: 'Erro', description: 'Falha na autenticação. Verifique suas credenciais.', variant: 'destructive' });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Form & Gradient */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#2E7D32] to-[#FDD835] flex flex-col justify-center px-12 lg:px-24 relative">
        
        {/* Logo Area */}
        <div className="absolute top-12 left-12 lg:left-24 flex flex-col">
          <div className="flex items-center gap-2 text-white mb-1">
             <h1 className="text-5xl font-extrabold tracking-tighter">LOGBIO</h1>
             <Ship className="h-8 w-8 mt-1" strokeWidth={3} />
          </div>
          <p className="text-[10px] text-white tracking-[0.2em] uppercase font-medium ml-1">
            Monitor de Bioincrustação
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm mt-20">
          <h2 className="text-4xl text-white font-normal mb-10">Log in</h2>
          
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-base font-medium">
                CPF/Matrícula
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu acesso"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-none h-12 rounded-xl text-lg placeholder:text-slate-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-base font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-none h-12 rounded-xl text-lg"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#003950] hover:bg-[#004d6b] text-white font-bold rounded-xl text-lg mt-4 transition-colors"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
        <img 
          src={heroShip} 
          alt="Navio em operação" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/10" /> {/* Overlay for better contrast if needed */}
      </div>
    </div>
  );
}
