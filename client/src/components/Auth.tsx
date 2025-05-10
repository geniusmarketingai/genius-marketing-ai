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
      
      toast({
        title: "Magic link enviado!",
        description: "Verifique seu e-mail para fazer login",
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

  const testSupabaseConnection = async () => {
    try {
      console.log("Testing Supabase connection");
      const { data, error } = await supabase.from('non_existent_table').select('*').limit(1);
      console.log("Supabase test response:", { data, error });
      
      toast({
        title: "Supabase connection test",
        description: error ? `Error: ${error.message}` : "Connection successful!",
        variant: error ? "destructive" : "default",
      });
    } catch (err) {
      console.error("Supabase test error:", err);
      toast({
        title: "Supabase test error",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
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
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              Novo por aqui? <a href="#" className="text-primary hover:text-primary/90 font-medium">Criar conta</a>
            </p>
            
            <div className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={testSupabaseConnection}
                className="w-full"
              >
                Testar Conexão Supabase
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
