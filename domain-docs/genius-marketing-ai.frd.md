# **📄 FRD – Genius Marketing AI (Functional Requirements Document)**

---

## **1\. 📘 Contexto**

O documento descreve os requisitos funcionais detalhados do sistema **Genius Marketing AI**, orientando a implementação das funcionalidades do MVP. Cada módulo segue a divisão por "Bounded Contexts" da metodologia DDD, permitindo clara separação de responsabilidades e alinhamento com uma arquitetura evolutiva.

---

## **2\. 📦 Módulos Funcionais**

### **2.1. 🔐 Módulo de Autenticação**

**Objetivo:** Permitir que usuários acessem a plataforma com segurança.

**Funcionalidades:**

* Login via magic link (Supabase Auth);

* Registro com e-mail;

* Logout;

* Persistência do token de sessão (localStorage ou cookies);

**Critérios de Aceitação:**

* O usuário deve receber um link válido em menos de 10 segundos;

* Sessões devem expirar após 7 dias sem uso.

---

### **2.2. 🧭 Módulo de Onboarding**

**Objetivo:** Coletar dados essenciais sobre o negócio do usuário para personalização do conteúdo.

**Campos obrigatórios:**

* Nicho de atuação (dropdown com sugestões);

* Persona alvo (input livre com sugestões);

* Canais de publicação (checkboxes múltiplos).

**Regras de Negócio:**

* Todos os campos são obrigatórios;

* O formulário deve ser finalizado para liberar a área de geração.

**Critérios de Aceitação:**

* Dados devem ser persistidos no `user_profile`;

* O progresso do onboarding deve ser armazenado (para retorno posterior).

---

### **2.3. 🧠 Módulo de Geração de Conteúdo**

**Objetivo:** Permitir ao usuário gerar diferentes tipos de conteúdo com IA.

**Tipos de conteúdo:**

* Post Instagram;

* Artigo de blog (SEO);

* Anúncio Facebook.

**Parâmetros configuráveis:**

* Objetivo (tráfego, vendas, engajamento);

* Tom de voz (descontraído, técnico, direto);

* Tema ou título;

* Canais (herdados do perfil).

**Regras de Negócio:**

* Cada geração consome 1 crédito;

* O sistema deve validar saldo antes de gerar;

* A IA deve gerar variações quando solicitado.

**Critérios de Aceitação:**

* Conteúdo gerado deve retornar em \< 3 segundos;

* Usuário deve poder copiar, salvar e regerar o conteúdo;

* Cada item gerado é salvo com status e tipo no `content_history`.

---

### **2.4. 📚 Módulo de Histórico**

**Objetivo:** Armazenar e listar conteúdos gerados pelo usuário.

**Ações permitidas:**

* Visualizar conteúdo salvo;

* Apagar conteúdo;

* Filtrar por tipo ou data.

**Regras de Negócio:**

* Apenas o dono pode acessar seu histórico (RLS por `auth.uid`);

* O sistema deve armazenar: título, tipo, data, status e texto completo.

**Critérios de Aceitação:**

* Lista paginada;

* Confirmação de exclusão com modal;

* Scroll infinito ou paginação.

---

### **2.5. 🎯 Módulo de Créditos**

**Objetivo:** Controlar o uso da IA por meio de créditos.

**Regras de Negócio:**

* Cada geração \= \-1 crédito;

* Créditos são renovados mensalmente ou por plano adquirido;

* Créditos extras podem ser adicionados via admin ou API.

**Critérios de Aceitação:**

* Usuário não pode gerar sem saldo;

* Créditos devem ser visíveis no dashboard e decrementados corretamente;

* Registro completo em tabela `credits` com origem, quantidade e timestamp.

---

### **2.6. 📊 Módulo de Métricas**

**Objetivo:** Exibir dados de uso e performance.

**Métricas mínimas:**

* Créditos restantes;

* Quantidade de conteúdos gerados;

* Taxa de cópia/exportação;

* Engajamento médio (futuramente via integração com redes).

**Regras de Negócio:**

* Métricas devem ser atualizadas em tempo real ou ao gerar conteúdo;

* Engajamento simulado inicialmente com base em cliques/interações.

**Critérios de Aceitação:**

* Exibição clara no painel;

* Integração com PostHog para eventos personalizados.

---

### **2.7. 🔌 Módulo de Integrações (Fase 2+)**

**Objetivo:** Permitir publicação, agendamento e envios automáticos via APIs externas.

**Integrações previstas:**

* Meta API (Instagram / Facebook);

* N8N / Activepieces;

* Mailchimp / RD Station (envio de conteúdo e leads).

**Regras de Negócio:**

* Toda integração deve exigir token válido via OAuth ou chave pessoal;

* Agendamentos devem estar armazenados no Supabase com status e timestamps;

* Logs de envio devem ser armazenados.

**Critérios de Aceitação:**

* Agendamentos e execuções devem ser rastreáveis;

* O usuário deve poder ativar/desativar integrações.

---

## **3\. 🧾 Requisitos Transversais**

| Requisito | Descrição |
| ----- | ----- |
| Auditoria | Toda ação relevante deve ser logada (geração, deleção, agendamento) |
| Testabilidade | Módulos com interfaces desacopladas, focados em injeção de dependência |
| Internacionalização futura | Design da base e textos com suporte i18n |
| Acessibilidade (WCAG AA) | Contrastes, navegação por teclado, inputs legíveis |
| Responsividade | 100% mobile-first conforme wireframes |

---

## **4\. 📁 Modelos de Dados (Resumo do Schema Prisma)**

| Entidade | Descrição |
| ----- | ----- |
| `User` | Usuário autenticado pela Supabase |
| `UserProfile` | Perfil com nicho, persona e canais |
| `Content` | Conteúdos gerados com IA, tags e status |
| `Credit` | Controle de créditos por usuário |

---

## **5\. 📌 APIs e Endpoints (Exemplos)**

Todos os endpoints autenticados via token do Supabase. Prefixo: `/api`

* `POST /generate` – Gera conteúdo com IA

* `GET /history` – Lista conteúdos do usuário

* `POST /credits/add` – Adiciona créditos manualmente (admin ou sistema)

* `GET /profile` – Retorna preferências do usuário

* `PUT /profile` – Atualiza perfil

* `DELETE /content/:id` – Exclui conteúdo

---

## **6\. ✅ Critérios Gerais de Aceitação**

* O sistema deve funcionar em português do Brasil com termos de marketing local;

* Todos os dados devem ser protegidos por RLS (`auth.uid()`), testável via Supabase Row Level Security;

* Cada módulo deve ter testes unitários (mínimo 80% cobertura) e integração com CI;

* O MVP deve ser deployável via Vercel e rastreável por PostHog.

