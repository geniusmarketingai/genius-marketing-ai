# **📘 PRD – Genius Marketing AI** **(Product Requirements Document)**

---

## **1\. 📌 Visão Geral do Produto**

**Nome do Produto:** Genius Marketing AI  
 **Tipo:** Plataforma SaaS  
 **Segmento:** Ferramenta de geração de conteúdo com IA para pequenos empreendedores e infoprodutores no Brasil.

**Resumo Executivo:**  
 O Genius Marketing AI é uma plataforma SaaS que permite a criação automática de conteúdo (posts para redes sociais, artigos de blog, anúncios, imagens, etc.), com foco em linguagem, tom e referências culturais brasileiras. Sua proposta é entregar criatividade escalável e personalizada, orientada por IA, para usuários que possuem pouco tempo, experiência ou orçamento para marketing digital profissional.

---

## **2\. 🎯 Objetivos do Produto**

* **Principal:** Automatizar a criação de conteúdo digital relevante para negócios brasileiros, com foco em performance e adaptação local.

* **Secundários:**

  * Aumentar o engajamento dos usuários em redes sociais;

  * Reduzir custos com agências e redatores;

  * Oferecer uma interface simples, responsiva e acessível;

  * Ser referência em IA aplicada ao marketing local.

---

## **3\. 👥 Personas**

1. **Empreendedor Individual (MEI):** Vende produtos ou serviços online e gerencia pessoalmente suas redes sociais.

2. **Infoprodutor:** Cria e vende cursos, mentorias, ebooks e precisa gerar textos persuasivos para anúncios e campanhas.

3. **Agência de Marketing Local:** Busca ferramentas escaláveis para gerar conteúdo para múltiplos clientes.

---

## **4\. 😫 Problemas do Usuário**

* Falta de tempo para criar conteúdo de qualidade;

* Dificuldade em adaptar linguagem e tom ao público;

* Uso de ferramentas estrangeiras que não entendem regionalismos;

* Baixo retorno sobre investimento com conteúdos genéricos.

---

## **5\. 💡 Solução Proposta**

Sistema SaaS com:

* Assistente de conteúdo com IA;

* Suporte a múltiplos formatos de mídia e plataformas;

* Adaptação à linguagem brasileira (gírias, nichos, tons);

* Integrações com redes sociais, CRMs e ferramentas de automação.

---

## **6\. 📦 Escopo do MVP**

### **Funcionalidades Mínimas**

* Cadastro e login com Supabase Auth (email, magic link);

* Onboarding com definição de nicho, persona e canais;

* Geração de conteúdo para:

  * Instagram (posts);

  * Facebook Ads;

  * Artigos de Blog (SEO);

* Histórico e painel de gerenciamento;

* Sistema de créditos para uso da IA;

* Exportação/cópia de conteúdo.

### **Fluxo do Usuário**

1. Cadastro/Login

2. Onboarding (nicho, persona, canais)

3. Escolha do tipo de conteúdo

4. Briefing rápido

5. Geração via IA

6. Preview, edição e exportação

7. Histórico e métricas

---

## **7\. 📊 Métricas de Sucesso**

* CAC (Custo de Aquisição por Cliente)

* LTV (Valor de Tempo de Vida do Cliente)

* Taxa de Conversão (Onboarding → Primeira Geração)

* Taxa de Engajamento com Conteúdos

* NPS (Net Promoter Score)

---

## **8\. 🧱 Requisitos Funcionais de Alto Nível**

| Área | Requisito |
| ----- | ----- |
| Autenticação | Login, logout, recuperação via magic link (Supabase) |
| Perfil | Cadastro de preferências: nicho, persona, canais |
| Geração de Conteúdo | Integração com OpenAI, modelos via prompt \+ parâmetros ajustáveis |
| Sistema de Créditos | Registro, controle e consumo por uso de IA |
| Histórico | Listagem, visualização, agrupamento e edição de conteúdos gerados |
| Métricas | Exibição de uso, créditos, engajamento e exportações |
| Integrações | APIs para redes sociais, automações N8N, e-mail marketing |

---

## **9\. 🔌 Integrações Externas Planejadas**

* **Supabase** (auth, DB, RLS)

* **OpenAI API** (Geração de conteúdo)

* **N8N / Activepieces** (automações)

* **APIs Meta / LinkedIn / Mailchimp / RD Station**

---

## **10\. 🧰 Tecnologias Escolhidas**

| Camada | Tecnologia | Justificativa |
| ----- | ----- | ----- |
| Frontend | Next.js \+ Tailwind | SSR \+ SEO \+ responsividade rápida |
| Backend | Next.js API Routes | Facilita coesão fullstack |
| Banco | Supabase (PostgreSQL) | Autenticação, RLS, triggers nativos |
| ORM | Prisma ORM | Compatível com Supabase, suporte a schema modular |
| DevOps | Vercel \+ Github | Deploy contínuo \+ integração com CI/CD |
| Dev Local | Replit | Prototipagem sem banco persistente |
| Automações | N8N | Agendamentos e integrações customizadas |

---

## **11\. 🔐 Requisitos Não-Funcionais**

* Autenticação segura (RLS ativa);

* Tempo de resposta inferior a 1s na geração via IA;

* Aplicação 100% em português;

* Deploy contínuo com rollback automatizado;

* Dados criptografados em trânsito e repouso.

---

## **12\. ⚠️ Riscos e Mitigações**

| Risco | Mitigação |
| ----- | ----- |
| Dependência do OpenAI | Implementar fallback com outros LLMs (ex: Cohere, Mistral) |
| Custo com uso de IA | Controle rigoroso por crédito/token |
| Performance em mobile | Mobile-first design e testes contínuos |
| Vazamento de dados | Supabase com RLS e políticas estritas por `auth.uid()` |

---

## **13\. 📂 Entregáveis**

* MVP funcional com 3 tipos de conteúdo

* Painel do usuário com geração, histórico e métricas

* Wireframes mobile-first com flowcharts em Mermaid.js

* Schema Prisma completo com RLS Supabase

* Documentação técnica no Cursor AI

* Manual do usuário (UX simples)

---

## **14\. 📍 Roadmap (Simplificado)**

| Fase | Entregas principais |
| ----- | ----- |
| Sprint 1 | Autenticação \+ Onboarding \+ Geração de conteúdo |
| Sprint 2 | Histórico \+ Créditos \+ Exportação |
| Sprint 3 | Integrações básicas (N8N, redes sociais) |
| Sprint 4 | Métricas \+ Otimização \+ Testes |
| Pós-MVP | Upsells, GPT-4 Turbo, Fine-tuning, multilínguas |

---

