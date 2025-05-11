import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
// import { Chrome, Facebook } from 'lucide-react'; // Exemplo se for usar lucide-react

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Novo estado
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false); // Novo estado
  const { signInWithPassword, signUp, signInWithOAuth } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUpMode) {
      await handleSignUp();
    } else {
      await handleLogin();
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const { error } = await signInWithPassword(email, password);
    setIsLoading(false);
    if (error) {
      toast({ title: "Erro no Login", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Login bem-sucedido!" });
      // O redirecionamento será tratado pelo AuthProvider/App.tsx ao detectar mudança no usuário
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast({ title: "Erro no Cadastro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Erro no Cadastro", description: "Senha deve ter no mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error: signUpError, data: signUpData } = await signUp(email, password);
    setIsLoading(false);
    if (signUpError) {
      toast({ title: "Erro no Cadastro", description: signUpError.message, variant: "destructive" });
    } else if (signUpData.user?.identities?.length === 0) {
      toast({ title: "Verificação Pendente", description: "Usuário já registrado mas e-mail não confirmado. Verifique seu e-mail ou contate suporte se o problema persistir.", variant: "default", duration: 10000 });
    } else if (signUpData.user) {
      toast({ title: "Cadastro realizado!", description: "Você pode fazer login agora." });
      setIsSignUpMode(false); // Volta para o modo de login após cadastro bem-sucedido
      setConfirmPassword(''); // Limpa o campo de confirmar senha
    } else {
      toast({ title: "Verifique seu e-mail", description: "Se o cadastro foi bem-sucedido, um e-mail de confirmação pode ter sido enviado (se configurado).", variant: "default", duration: 10000 });
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    const { error } = await signInWithOAuth(provider);
    // Não precisa setar setIsLoading(false) aqui, pois a página será redirecionada
    if (error) {
      toast({ title: `Erro com ${provider}`, description: error.message, variant: "destructive" });
      setIsLoading(false); // Só setar se houver erro e não houver redirecionamento
    }
    // O redirecionamento é tratado pelo Supabase e o App.tsx detectará a mudança de sessão
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Genius Marketing AI</h1>
            <p className="text-muted-foreground">
              {isSignUpMode ? 'Crie sua nova conta' : 'Acesse sua conta'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                type="email" 
                id="email" 
                placeholder="seu@email.com.br" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input 
                type="password" 
                id="password" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={isSignUpMode ? 6 : undefined} // Garante mínimo de 6 para cadastro no input
                disabled={isLoading}
              />
            </div>
            {isSignUpMode && (
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input 
                  type="password" 
                  id="confirmPassword" 
                  placeholder="********" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : (isSignUpMode ? 'Cadastrar' : 'Entrar')}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isSignUpMode ? (
              <>
                Já tem uma conta?{' '}
                <Button variant="link" onClick={toggleMode} className="p-0 h-auto font-semibold" disabled={isLoading}>
                  Faça login
                </Button>
              </>
            ) : (
              <>
                Não tem uma conta?{' '}
                <Button variant="link" onClick={toggleMode} className="p-0 h-auto font-semibold" disabled={isLoading}>
                  Cadastre-se
                </Button>
              </>
            )}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleOAuthSignIn('google')} 
              disabled={isLoading}
              className="w-full" // Garante que o botão ocupe toda a largura da coluna
            >
              {/* <Chrome className="mr-2 h-4 w-4" /> Exemplo com Lucide */}
              {isLoading ? 'Aguarde...' : 'Google'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleOAuthSignIn('facebook')} 
              disabled={isLoading}
              className="w-full" // Garante que o botão ocupe toda a largura da coluna
            >
              {/* <Facebook className="mr-2 h-4 w-4" /> Exemplo com Lucide */}
              {isLoading ? 'Aguarde...' : 'Facebook'}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
