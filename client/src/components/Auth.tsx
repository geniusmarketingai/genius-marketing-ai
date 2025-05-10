import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from '../lib/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signInWithMagicLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit form triggered");
    
    if (!email || !email.includes('@')) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    console.log("Trying to sign in with email:", email);
    
    try {
      console.log("Calling signInWithMagicLink");
      const response = await signInWithMagicLink(email);
      console.log("Sign in response:", response);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Construir um link de login direto (para o usuário copiar se precisar)
      const loginUrl = `${window.location.origin}/login#email=${encodeURIComponent(email)}`;
      
      toast({
        title: "Magic link enviado!",
        description: 
          <div className="space-y-2">
            <p>Verifique seu e-mail para fazer login</p>
            <p className="text-xs text-muted-foreground">
              Se tiver problemas, use este link: 
              <button 
                onClick={() => { navigator.clipboard.writeText(loginUrl); toast({ description: "Link copiado!" }); }}
                className="underline ml-1 cursor-pointer"
              >
                Copiar link de login
              </button>
            </p>
          </div>,
      });
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Erro ao enviar magic link",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Genius Marketing AI</h1>
            <p className="text-muted-foreground">Crie conteúdo excepcional com IA</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                type="email" 
                id="email" 
                placeholder="seu@email.com.br" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Enviando...
                </>
              ) : (
                <>
                  Entrar com Magic Link
                  <i className="fas fa-magic ml-2"></i>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
