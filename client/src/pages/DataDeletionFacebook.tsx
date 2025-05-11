import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function DataDeletionFacebook() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Exclusão de Dados – Login com Facebook</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto">
          <p>
            Nosso aplicativo permite login via Facebook. Ao fazer isso, coletamos apenas seu nome e e-mail para fins de autenticação.
          </p>
          
          <p>
            Se você deseja excluir todos os dados associados ao seu login do Facebook:
          </p>
          <ul>
            <li>Envie um e-mail para: geniusmarketingai@gmail.com</li>
            <li>Assunto: Exclusão de Dados do Facebook</li>
            <li>Inclua o e-mail usado no login</li>
          </ul>
          <p>
            Seu pedido será processado em até 7 dias úteis.
          </p>
          
          <p>
            Para mais informações, consulte nossa Política de Privacidade em: <Link href="/privacy-policy" className="text-primary hover:underline">https://genius-marketing-ai.vercel.app/privacy-policy</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 