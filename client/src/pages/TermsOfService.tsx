import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">📘 Termos de Uso – Genius Marketing AI</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto">
          <p className="text-muted-foreground text-center mb-6">
            Última atualização: Maio de 2025
          </p>

          <p>
            Ao utilizar a plataforma Genius Marketing AI, você concorda com os termos e condições descritos abaixo. Leia com atenção.
          </p>

          <h2>1. Sobre o serviço</h2>
          <p>
            O Genius Marketing AI é uma plataforma SaaS que utiliza inteligência artificial para auxiliar na criação de conteúdo de marketing personalizado, especialmente voltado ao público brasileiro.
          </p>

          <h2>2. Cadastro e acesso</h2>
          <p>
            Você deve fornecer informações verdadeiras ao criar uma conta.
          </p>
          <p>
            É responsável por manter a segurança e confidencialidade de sua conta.
          </p>
          <p>
            O acesso pode ser suspenso em caso de uso indevido ou violação destes termos.
          </p>

          <h2>3. Uso da plataforma</h2>
          <p>
            O conteúdo gerado pela IA é baseado nas informações fornecidas por você.
          </p>
          <p>
            Não nos responsabilizamos por decisões comerciais baseadas exclusivamente no conteúdo gerado.
          </p>
          <p>
            O uso da plataforma deve seguir as leis brasileiras e evitar qualquer tipo de conteúdo ofensivo, ilegal ou que viole direitos de terceiros.
          </p>

          <h2>4. Propriedade intelectual</h2>
          <p>
            Os textos, interfaces, sistema e marca Genius Marketing AI são protegidos por direitos autorais.
          </p>
          <p>
            O conteúdo gerado pela IA é de uso exclusivo do usuário autenticado, podendo ser reutilizado livremente em seus canais (exceto em revenda como produto de terceiros).
          </p>

          <h2>5. Cancelamento e exclusão</h2>
          <p>
            O usuário pode encerrar sua conta a qualquer momento.
          </p>
          <p>
            Nos reservamos o direito de remover contas inativas ou que infrinjam estes termos.
          </p>

          <h2>6. Alterações nos termos</h2>
          <p>
            Podemos atualizar estes termos periodicamente. A versão mais recente estará sempre disponível nesta página.
          </p>

          <h2>7. Contato</h2>
          <p>
            Em caso de dúvidas ou suporte, entre em contato com nossa equipe:
            <br />
            📧 geniusmarketingai@gmail.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 