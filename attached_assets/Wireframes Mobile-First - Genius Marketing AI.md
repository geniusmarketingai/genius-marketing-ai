## **📱 Wireframes Mobile-First — Genius Marketing AI**

### **1\. Login / Registro**

flowchart TD  
  A\["📲 Genius AI"\]  
  A \--\> B\[📧 Campo de Email\]  
  B \--\> C\[🔒 Botão: "Entrar"\]  
  A \--\> D\["Novo por aqui? Criar conta"\]

📌 *Layout:*

* Centralizado na tela

* Botão ocupar 100% da largura

* Magic link enviado por Supabase Auth

### **2\. Onboarding em Etapas**

flowchart TD  
  A\[Etapa 1: Qual seu nicho?\] \--\> B\[Dropdown com opções\]  
  B \--\> C\[Botão: Próximo ➡️\]  
  C \--\> D\[Etapa 2: Persona alvo?\]  
  D \--\> E\[Ex: Jovens mães, empreendedores, médicos\]  
  E \--\> F\[➡️ Etapa 3: Onde publica?\]  
  F \--\> G\[Checkboxes: Instagram, Blog, WhatsApp\]  
  G \--\> H\[✅ Botão: "Concluir"\]

📌 *Layout:*

* Etapas sequenciais tipo wizard

* Progress bar ou indicadores no topo

* Tudo empilhado e com `w-full`

### **3\. Dashboard Inicial**

flowchart TD  
  A\["👋 Olá, \[Nome\]\!"\]  
  A \--\> B\[Botão fixo: ➕ Novo Conteúdo\]  
  A \--\> C\["📄 Últimos conteúdos gerados"\]  
  C \--\> D\["Card 1: Post Instagram"\]  
  C \--\> E\["Card 2: Blog SEO"\]  
  C \--\> F\[Botão: Ver todos\]  
  A \--\> G\["📊 Créditos: 12 restantes"\]

📌 *Layout:*

* Cards com scroll vertical

* Botão flutuante (FAB) no canto inferior direito com `position: fixed`

* Área de “Créditos” em destaque com CTA para upgrade

### **4\. Formulário de Geração**

flowchart TD  
  A\["Tipo de conteúdo:"\]  
  A \--\> B\[Select: Instagram / Anúncio / Blog\]  
  B \--\> C\["🎯 Objetivo: Tráfego | Vendas | Engajamento"\]  
  C \--\> D\["📝 Tema ou título"\]  
  D \--\> E\["🎤 Tom de voz: Descontraído, Técnico, Direto"\]  
  E \--\> F\[Botão: "Gerar com IA 🚀"\]

📌 *Layout:*

* Inputs com espaçamento generoso

* Labels claras e acessíveis

* Botão “Gerar” em destaque, fixo no final da tela no mobile

### **5\. Preview e Ações**

flowchart TD  
  A\["🎉 Conteúdo gerado\!"\]  
  A \--\> B\["Texto gerado (área scrollável)"\]  
  B \--\> C\[Botões: ✅ Salvar | 🔁 Regerar | 📋 Copiar\]  
  C \--\> D\[🔽 Avançado: Exportar ou Agendar\]

📌 *Layout:*

* Preview em card com scroll lateral se necessário

* Botões com ícones e labels claras

* Espaço para edição inline, se desejado (campo `contenteditable`)

### **6\. Histórico de Conteúdos**

flowchart TD  
  A\["📚 Histórico"\]  
  A \--\> B\["Card: Post \- Instagram"\]  
  B \--\> C\["🕒 Data | 💬 Título"\]  
  B \--\> D\["👁 Ver | 🗑 Apagar"\]  
  A \--\> E\["Card: Blog \- SEO"\]

📌 *Layout:*

* Cards com swipe actions (opcional)

* Modal de confirmação para exclusão

* Agrupamento por tipo ou data (scroll infinito ou paginação)

### **7\. Métricas Simples**

flowchart TD  
  A\["📈 Seu desempenho"\]  
  A \--\> B\["📝 Conteúdos criados: 32"\]  
  A \--\> C\["💬 Engajamento médio: 72%"\]  
  A \--\> D\["📉 Taxa de cópia/exportação: 85%"\]  
  A \--\> E\["📊 Créditos restantes: 8"\]

📌 *Layout:*

* Blocos tipo card (`flex flex-col`)

* Ícones ilustrativos \+ valores grandes

* Responsivo com gráficos futuros via Chart.js (mobile-otimizados)

## **🧪 Teste Mobile com Tailwind (Exemplo prático)**

\<div class="flex flex-col gap-4 p-4 max-w-sm mx-auto"\>  
  \<label class="text-sm font-semibold"\>Tipo de conteúdo\</label\>  
  \<select class="border rounded p-2"\>  
    \<option\>Instagram\</option\>  
    \<option\>Blog SEO\</option\>  
  \</select\>  
  \<label class="text-sm font-semibold"\>Tema\</label\>  
  \<input class="border p-2 rounded" placeholder="Ex: Como vender no WhatsApp" /\>  
  \<button class="bg-blue-600 text-white py-3 rounded"\>Gerar com IA\</button\>  
\</div\>