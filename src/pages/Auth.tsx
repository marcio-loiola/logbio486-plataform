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

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  useEffect(() => {
    let timeoutId: number;
    if (failedAttempts >= 5) {
      setIsLocked(true);
      toast({
        title: 'Bloqueado',
        description: 'Muitas tentativas falhas. Aguarde 60 segundos.',
        variant: 'destructive',
      });
      timeoutId = window.setTimeout(() => {
        setIsLocked(false);
        setFailedAttempts(0);
      }, 60000);
    }
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [failedAttempts, toast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({ title: 'Aviso', description: 'Aguarde antes de tentar novamente.', variant: 'destructive' });
      return;
    }

    const emailValidation = emailSchema.safeParse(email);
    // Allow any non-empty password during login to support legacy users.
    // Strict schema is reserved for registration/password change.
    const passwordValidation = password.trim().length > 0;
    
    if (!emailValidation.success) {
      toast({ title: 'Erro', description: 'Email ou senha inválidos.', variant: 'destructive' });
      setFailedAttempts((prev) => prev + 1);
      return;
    }
    
    if (!passwordValidation) {
      toast({ title: 'Erro', description: 'Email ou senha inválidos.', variant: 'destructive' });
      setFailedAttempts((prev) => prev + 1);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setFailedAttempts((prev) => prev + 1);
      // Mensagem genérica para não dar dicas sobre a existência do usuário
      toast({ title: 'Erro', description: 'Email ou senha inválidos.', variant: 'destructive' });
    } else {
      setFailedAttempts(0);
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
              className="w-full h-12 bg-[#003950] hover:bg-[#004d6b] text-white font-bold rounded-xl text-lg mt-4 transition-colors disabled:opacity-50"
              disabled={loading || isLocked}
            >
              {loading ? 'Entrando...' : isLocked ? 'Bloqueado' : 'Entrar'}
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
