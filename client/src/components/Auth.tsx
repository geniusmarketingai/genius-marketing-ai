import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signInWithMagicLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signInWithMagicLink(email);
      
      if (error) {
        throw new Error(error.message);
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
