# **🧠 GENIUS MARKETING AI: Assistente de Conteúdo com IA para o Brasil**

## **1\. 🧩 Estrutura do Projeto em Alto Nível**

### **🎯 Proposta de Valor**

Automatize a criação de conteúdo profissional em português brasileiro com um assistente de IA adaptado ao mercado local, ajudando pequenos empreendedores e infoprodutores a escalar sua presença online com criatividade, agilidade e performance.

### **😫 Dor do Cliente**

* Falta de tempo para criar conteúdo consistente.

* Dificuldade em escrever com qualidade e adaptar linguagem ao público.

* Baixo retorno em anúncios e redes sociais por textos genéricos.

* Alto custo com redatores ou agências.

### **💡 Solução Proposta**

Uma plataforma SaaS com IA treinada em português brasileiro e focada em conteúdo de alta conversão, que permite ao usuário gerar textos, imagens, anúncios e publicações sociais com base em seu nicho, canal e objetivo (engajamento, tráfego, vendas).

### **⭐ Benefícios-chave**

* Criação de conteúdo 10x mais rápida;

* Adaptação ao tom e regionalismos do Brasil;

* Templates prontos e inteligentes para diferentes canais;

* Métricas de engajamento por conteúdo gerado;

* IA com memória contextual do perfil do negócio.

## **2\. 🛠️ Escopo do MVP Funcional**

### **✅ Funcionalidades mínimas**

* Cadastro e login com autenticação Supabase;

* Onboarding com escolha de nicho, persona e canais usados;

* Geração de conteúdo por tipo: post, blog, anúncio, copy CTA;

* Salvamento e histórico de conteúdos;

* Editor com preview e exportação (copy/download);

* Sistema de créditos (tokens de uso);

* Dashboard básico com métricas e uso.

### **🔄 Fluxo de uso do usuário**

graph LR  
A\[Cadastro/Login\] \--\> B\[Onboarding com preferências\]  
B \--\> C\[Escolha do tipo de conteúdo\]  
C \--\> D\[Preenchimento rápido do briefing\]  
D \--\> E\[Geração via IA \+ opções de variação\]  
E \--\> F\[Preview, edição e exportação\]  
F \--\> G\[Salvar no histórico\]  
G \--\> H\[Visualizar métricas do conteúdo\]

### **🚀 Primeira entrega funcional (Fase 1 MVP)**

* Geração de 3 tipos de conteúdo: Post Instagram, Anúncio Facebook, Blog SEO;

* Sistema de login e perfil com Supabase;

* Editor simples com botão de copiar e salvar;

* Banco de dados Supabase com políticas de segurança;

* Interface em português com Tailwind CSS e Next.js.

### **🧩 Wireframes básicos sugeridos**

1. **Login / Onboarding**

2. **Painel com histórico e botão “Criar Novo Conteúdo”**

3. **Formulário de input \+ opções rápidas (tom, objetivo, canal)**

4. **Resultado com preview, variações e botões: copiar, salvar, exportar**

5. **Tela de métricas (mínima)**

Posso desenhar os wireframes em Mermaid.js se desejar.

## **3\. 🧱 Stack Tecnológica Ideal**

| Camada | Stack | Justificativa |
| ----- | ----- | ----- |
| Frontend | **Next.js \+ Tailwind CSS** | SSR \+ performance \+ SEO nativo. Tailwind para agilidade de UI. |
| Backend | **Node.js \+ API REST ou App Router Next.js 14** | Alinhado ao fullstack moderno com Vercel. |
| ORM | **Prisma ORM** | Usado com Supabase respeitando constraints e permissões. |
| Banco | **Supabase** | Autenticação, banco SQL, storage, Row Level Security e APIs. |
| Dev Env | **Replit** | Para desenvolvimento local sem persistência. |
| DevOps | **Vercel \+ Github \+ CI/CD \+ Cursor AI** | Deploy instantâneo, integração rápida, preview por branch. |
| Automações | **N8N** | Envio de e-mails, notificações, fluxos com IA e redes sociais. |

## **4\. 🧰 Arquitetura do Sistema SaaS**

flowchart TD  
subgraph Frontend \[Frontend \- Next.js\]  
F1\[UI: Formulário de conteúdo\]  
F2\[Dashboard do usuário\]  
F3\[Auth via Supabase\]  
end

subgraph Backend \[Backend/API \- Next.js ou Lambda\]  
B1\[Gerar conteúdo via OpenAI\]  
B2\[Consulta/Salvamento no Supabase\]  
B3\[Sistema de créditos/token IA\]  
end

subgraph Supabase \[Supabase DB\]  
S1\[auth.users\]  
S2\[content\_history\]  
S3\[user\_profile\]  
S4\[credits\]  
end

subgraph N8N \[Automação\]  
N1\[Postagem automática\]  
N2\[Envio de relatório\]  
end

F1 \--\> B1  
F2 \--\> B2  
B1 \--\> S2  
B2 \--\> S1  
B2 \--\> S3  
B2 \--\> S4  
B1 \--\> N8N

### **Características da arquitetura**

* Total separação de camadas;

* Escalabilidade via Vercel (API Functions);

* RLS ativa no Supabase com políticas por `auth.uid`;

* Integração modular com N8N por Webhook \+ Trigger;

* Logs e eventos pensados para PostHog ou Mixpanel.

## **5\. 🧩 Módulos/Microserviços do Sistema**

| Módulo | Função |
| ----- | ----- |
| Auth | Registro/Login via Supabase (email e magic link) |
| Perfil | Dados do negócio, persona, canais |
| Geração IA | Módulo principal de integração com OpenAI (prompt \+ params) |
| Histórico | Armazena conteúdos, status e tags |
| Templates | Blocos de prompt pré-modelados |
| Créditos | Limita uso de IA e controla plano |
| Dashboard | Exibe conteúdos salvos, engajamento e tokens restantes |

## **6\. 🔌 Integrações via API**

| Plataforma | Uso proposto |
| ----- | ----- |
| Instagram/Facebook | Postagens automáticas via Meta API |
| LinkedIn | Compartilhamento de conteúdos |
| Mailchimp / Brevo | Geração de emails \+ envio automático |
| N8N / Activepieces | Workflows de conteúdo programado |
| RD Station | Envio de leads \+ conteúdo automatizado |

## **7\. 🥇 Diferenciais Competitivos (Brasil)**

| Plataforma | Idioma PT-BR | Regionalismos | Templates Brasil | Preço Inicial | Geração de Anúncios |
| ----- | ----- | ----- | ----- | ----- | ----- |
| **Genius AI** | ✅ Nativo | ✅ Gírias, sotaques | ✅ Foco em nichos 🇧🇷 | A partir de R$29 | ✅ Integrado |
| Jasper.ai | ⚠️ Traduzido | ❌ Neutro | ❌ Genérico | US$49/mês | ✅ Limitado |
| Copy.ai | ✅ Traduzido | ❌ | ❌ | US$36/mês | ✅ |
| Writesonic | ✅ | ❌ | ❌ | US$19/mês | ✅ |
| Rytr.me | ✅ | ❌ | ❌ | US$9/mês | ❌ |

## **8\. 💰 Modelos de Precificação SaaS**

* **Freemium:** 10 créditos gratuitos por mês (ex: 5 conteúdos).

* **Plano Starter:** R$29/mês — 50 créditos.

* **Plano Pro:** R$59/mês — 200 créditos \+ agendamento via N8N.

* **Plano Agência:** R$129/mês — 500 créditos, múltiplos perfis.

### **Estratégias de upsell**

* Créditos adicionais;

* Planos por nicho (Imobiliário, Estética, Coaching etc.);

* Add-on: GPT-4 Turbo, agendamento de posts, IA com memória.

## **9\. 🧠 Treinamento e Customização da IA**

| Técnica | Aplicação |
| ----- | ----- |
| Prompt Engineering | Contexto com persona, canal, objetivo e tom |
| Embeddings \+ Vetores (Supabase Vector) | Indexação por nicho \+ exemplos salvos |
| RAG | Recupera exemplos de conteúdo brasileiro relevante |
| Fine Tuning (Futuro) | Setores específicos com base em datasets reais |
| IA com memória leve | Contextualização por usuário e nicho salvo no perfil |

## **10\. 📊 Métricas do MVP**

* **CAC** (Custo por aquisição);

* **LTV** (Valor de tempo de vida do usuário);

* **NPS** (Net Promoter Score);

* **Taxa de engajamento por tipo de conteúdo gerado**;

* **Conversão: Registro → Conteúdo → Upgrade de plano**;

### **Ferramentas**

* **PostHog** para eventos customizados e funis;

* **GA4** para tráfego e sessões;

* **Mixpanel** para cohort de retenção.

## **11\. 📁 Documentos Fundamentais e Como Usar**

| Documento | Função | Aplicação em ferramentas |
| ----- | ----- | ----- |
| **PRD** | Visão geral do produto, personas, casos de uso | Documentado no Cursor AI ou Notion |
| **FRD** | Detalhamento técnico por funcionalidade | Repositório Github com issues vinculadas |
| **Mermaid.js Flowcharts** | Lógica de navegação e backend | Usado no Lovable.dev e PRs |
| **Prisma Schema** | Base de dados modelada para Supabase | Versão trackeada no GitHub |
| **Roadmap** | Releases, backlog, milestones | Github Projects ou Linear |

