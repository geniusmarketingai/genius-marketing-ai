import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Termos de Uso</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto">
          <p className="text-muted-foreground text-center mb-6">
            Última atualização: [INSERIR DATA]
          </p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o Genius Marketing AI (o \"Serviço\"), você aceita e concorda em ficar vinculado pelos termos e disposições deste acordo. Além disso, ao usar estes serviços particulares, você estará sujeito a quaisquer diretrizes ou regras publicadas aplicáveis a esses serviços. Qualquer participação neste serviço constituirá aceitação deste acordo. Se você não concordar em cumprir o acima, por favor, não use o serviço.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            O Genius Marketing AI fornece [DESCRIÇÃO DETALHADA DO SERVIÇO]. Você entende e concorda que o Serviço é fornecido \"COMO ESTÁ\" e que a nossa empresa não assume responsabilidade pela pontualidade, exclusão, falha na entrega ou falha no armazenamento de quaisquer comunicações do usuário ou configurações de personalização.
          </p>

          <h2>3. Registro e Segurança da Conta</h2>
          <p>
            Para usar certas funcionalidades do Serviço, você pode ser obrigado a se registrar para uma conta. Ao se registrar, você concorda em fornecer informações verdadeiras, precisas, atuais e completas sobre si mesmo. Você é responsável por manter a confidencialidade da sua senha e conta, e é totalmente responsável por todas coercitivas que ocorram sob sua senha ou conta.
          </p>

          <h2>4. Uso Aceitável</h2>
          <p>
            Você concorda em não usar o Serviço para:
          </p>
          <ul>
            <li>Violar quaisquer leis locais, estaduais, nacionais ou internacionais.</li>
            <li>Prejudicar menores de qualquer forma.</li>
            <li>Personificar qualquer pessoa ou entidade, ou declarar falsamente ou de outra forma deturpar sua afiliação com uma pessoa ou entidade.</li>
            <li>Carregar, postar, enviar por e-mail, transmitir ou de outra forma disponibilizar qualquer Conteúdo que seja ilegal, prejudicial, ameaçador, abusivo, ofensivo, difamatório, vulgar, obsceno, invasivo da privacidade de outrem, odioso, ou racialmente, etnicamente ou de outra forma censurável.</li>
            <li>Interferir ou interromper o Serviço ou servidores ou redes conectadas ao Serviço.</li>
          </ul>

          <h2>5. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo incluído no Serviço, como texto, gráficos, logotipos, ícones de botão, imagens, clipes de áudio, downloads digitais, compilações de dados e software, é propriedade da nossa empresa ou de seus fornecedores de conteúdo e protegido pelas leis internacionais de direitos autorais.
          </p>
          
          <h2>6. Limitação de Responsabilidade</h2>
          <p>
            EM NENHUMA CIRCUNSTÂNCIA A NOSSA EMPRESA SERÁ RESPONSÁVEL POR QUAISQUER DANOS DIRETOS, INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU EXEMPLARES, INCLUINDO, MAS NÃO SE LIMITANDO A, DANOS POR PERDA DE LUCROS, BOA VONTADE, USO, DADOS OU OUTRAS PERDAS INTANGÍVEIS (MESMO QUE A NOSSA EMPRESA TENHA SIDO AVISADA DA POSSIBILIDADE DE TAIS DANOS), RESULTANTES DE:
          </p>
          <ul>
            <li>O USO OU A IMPOSSIBILIDADE DE USAR O SERVIÇO;</li>
            <li>O CUSTO DE AQUISIÇÃO DE BENS E SERVIÇOS SUBSTITUTOS RESULTANTES DE QUAISQUER BENS, DADOS, INFORMAÇÕES OU SERVIÇOS COMPRADOS OU OBTIDOS OU MENSAGENS RECEBIDAS OU TRANSAÇÕES REALIZADAS ATRAVÉS OU DO SERVIÇO;</li>
            <li>ACESSO NÃO AUTORIZADO OU ALTERAÇÃO DE SUAS TRANSMISSÕES OU DADOS;</li>
            <li>DECLARAÇÕES OU CONDUTA DE QUALQUER TERCEIRO NO SERVIÇO;</li>
            <li>OU QUALQUER OUTRO ASSUNTO RELACIONADO AO SERVIÇO.</li>
          </ul>

          <h2>7. Modificações ao Serviço e aos Termos</h2>
          <p>
            Reservamo-nos o direito de, a qualquer momento e de tempos em tempos, modificar ou descontinuar, temporária ou permanentemente, o Serviço (ou qualquer parte dele) com ou sem aviso prévio. Você concorda que nossa empresa não será responsável perante você ou qualquer terceiro por qualquer modificação, suspensão ou descontinuação do Serviço. Podemos também alterar estes Termos de Uso de tempos em tempos. Seu uso continuado do Serviço após tais alterações constituirá seu consentimento para tais alterações.
          </p>

          <h2>8. Lei Aplicável</h2>
          <p>
            Estes Termos de Uso serão regidos e interpretados de acordo com as leis do [INSERIR JURISDIÇÃO, por exemplo, Brasil], sem consideração aos seus conflitos de disposições legais.
          </p>

          <h2>9. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco em: [INSERIR ENDEREÇO DE E-MAIL DE CONTATO].
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 