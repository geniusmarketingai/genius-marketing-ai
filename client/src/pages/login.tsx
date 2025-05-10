import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Extract email from URL hash if present
    const hash = window.location.hash;
    if (hash && hash.includes('email=')) {
      const emailParam = new URLSearchParams(hash.substring(1)).get('email');
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    }
  }, []);

  // Authenticate the user
  const handleLogin = async () => {
    if (!email) {
      toast({
        title: "E-mail necessário",
        description: "Por favor, forneça seu e-mail para continuar",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Magic link enviado!",
        description: "Verifique seu e-mail para fazer login",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Genius Marketing AI</h1>
            <p className="text-muted-foreground">Login direto</p>
          </div>

          {email ? (
            <div className="space-y-6">
              <p className="text-center">
                Clique no botão abaixo para receber um novo Magic Link para <strong>{email}</strong>
              </p>
              
              <Button 
                onClick={handleLogin}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Enviando Magic Link...
                  </>
                ) : (
                  'Enviar Magic Link'
                )}
              </Button>
              
              <div className="text-center mt-4">
                <Button
                  variant="link"
                  onClick={() => setLocation('/')}
                >
                  Voltar para o login principal
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">Link inválido ou expirado.</p>
              <Button
                onClick={() => setLocation('/')}
              >
                Voltar para o login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}