import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">📜 Política de Privacidade – Genius Marketing AI</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto">
          <p className="text-muted-foreground text-center mb-6">
            Última atualização: Maio de 2025
          </p>

          <p>
            Na Genius Marketing AI, levamos sua privacidade a sério. Este documento explica como coletamos, usamos, armazenamos e protegemos seus dados pessoais ao utilizar nossa plataforma.
          </p>

          <h2>1. Informações que coletamos</h2>
          <p>
            Ao usar nossa plataforma, podemos coletar:
          </p>
          <ul>
            <li>Seu nome e e-mail ao se cadastrar;</li>
            <li>Informações sobre seu negócio (nicho, público-alvo, preferências de conteúdo);</li>
            <li>Histórico de conteúdo gerado na plataforma;</li>
            <li>Dados de uso (páginas acessadas, interações, tempo de navegação).</li>
          </ul>

          <h2>2. Como usamos seus dados</h2>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul>
            <li>Personalizar sua experiência com a IA;</li>
            <li>Melhorar nossos produtos e funcionalidades;</li>
            <li>Enviar notificações sobre atualizações ou conteúdos relevantes (caso autorizado);</li>
            <li>Realizar análises internas e métricas de uso (anonimizadas sempre que possível).</li>
          </ul>

          <h2>3. Armazenamento e segurança</h2>
          <p>
            Todos os dados são armazenados com segurança em servidores parceiros como Supabase e Vercel.
          </p>
          <p>
            Adotamos práticas modernas de proteção, incluindo criptografia e autenticação segura.
          </p>
          <p>
            Nunca venderemos ou compartilharemos seus dados com terceiros sem sua autorização explícita.
          </p>

          <h2>4. Seus direitos</h2>
          <p>
            Você pode, a qualquer momento:
          </p>
          <ul>
            <li>Solicitar acesso ou correção de seus dados;</li>
            <li>Solicitar exclusão da sua conta e de todos os dados associados;</li>
            <li>Optar por não receber comunicações.</li>
          </ul>

          <h2>5. Contato</h2>
          <p>
            Para dúvidas, sugestões ou solicitações relacionadas à sua privacidade, fale conosco:
            <br />
            📧 geniusmarketingai@gmail.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 