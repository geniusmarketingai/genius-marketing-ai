import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className=\"min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex justify-center\">
      <Card className=\"w-full max-w-3xl\">
        <CardHeader>
          <CardTitle className=\"text-2xl font-bold text-center\">Política de Privacidade</CardTitle>
        </CardHeader>
        <CardContent className=\"prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto\">
          <p className=\"text-muted-foreground text-center mb-6\">
            Última atualização: [INSERIR DATA]
          </p>

          <h2>1. Introdução</h2>
          <p>
            Bem-vindo à Política de Privacidade do Genius Marketing AI. Nós valorizamos sua privacidade e estamos comprometidos em proteger suas informações pessoais. Esta política descreve como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nossos serviços.
          </p>

          <h2>2. Informações que Coletamos</h2>
          <p>
            Podemos coletar as seguintes informações sobre você:
          </p>
          <ul>
            <li><strong>Informações Pessoais:</strong> Nome, endereço de e-mail, informações de pagamento e outras informações que você nos fornece diretamente.</li>
            <li><strong>Informações de Uso:</strong> Informações sobre como você usa nosso site e serviços, como seu endereço IP, tipo de navegador, páginas visitadas, tempo gasto nas páginas e outras estatísticas.</li>
            <li><strong>Cookies e Tecnologias Semelhantes:</strong> Usamos cookies para coletar informações sobre sua atividade de navegação.</li>
          </ul>

          <h2>3. Como Usamos Suas Informações</h2>
          <p>
            Usamos suas informações para:
          </p>
          <ul>
            <li>Fornecer, operar e manter nossos serviços.</li>
            <li>Melhorar, personalizar e expandir nossos serviços.</li>
            <li>Entender e analisar como você usa nossos serviços.</li>
            <li>Desenvolver novos produtos, serviços, recursos e funcionalidades.</li>
            <li>Comunicar com você, diretamente ou através de um de nossos parceiros, incluindo para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas ao serviço, e para fins de marketing e promocionais.</li>
            <li>Processar suas transações.</li>
            <li>Encontrar e prevenir fraudes.</li>
          </ul>

          <h2>4. Compartilhamento de Informações</h2>
          <p>
            Podemos compartilhar suas informações nas seguintes situações:
          </p>
          <ul>
            <li>Com provedores de serviços terceirizados para nos ajudar a operar nosso negócio.</li>
            <li>Para cumprir obrigações legais.</li>
            <li>Para proteger nossos direitos e propriedade.</li>
            <li>Com seu consentimento.</li>
          </ul>

          <h2>5. Segurança de Dados</h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações pessoais, mas lembre-se que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
          </p>

          <h2>6. Seus Direitos de Privacidade</h2>
          <p>
            Dependendo da sua localização, você pode ter certos direitos em relação às suas informações pessoais, como o direito de acessar, corrigir ou excluir suas informações.
          </p>

          <h2>7. Alterações a Esta Política de Privacidade</h2>
          <p>
            Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página.
          </p>

          <h2>8. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em: [INSERIR ENDEREÇO DE E-MAIL DE CONTATO].
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 