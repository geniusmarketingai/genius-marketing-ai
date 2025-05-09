\# 🧠 Genius Marketing AI – Fluxos UX e Backend (Mermaid)

\---

\#\# 🔄 Fluxo Geral do Usuário (UX)

\`\`\`mermaid  
flowchart TD  
  A\[🔐 Login / Registro\] \--\> B\[🧭 Onboarding (nicho, persona, canais)\]  
  B \--\> C\[📋 Dashboard Inicial\]  
  C \--\> D\[➕ Novo Conteúdo\]  
  D \--\> E\[📝 Formulário de Geração\]  
  E \--\> F\[⚙️ Chamada IA (OpenAI)\]  
  F \--\> G\[📄 Preview do Conteúdo\]  
  G \--\> H{✅ Ações}  
  H \--\>|Salvar| I\[💾 Armazenar no Histórico\]  
  H \--\>|Copiar| J\[📋 Copiado para área de transferência\]  
  H \--\>|Regerar| F  
  C \--\> K\[📊 Ver Métricas\]  
  C \--\> L\[📚 Ver Histórico\]

---

## **🧠 Lógica de Backend – Geração de Conteúdo com Créditos**

flowchart TD  
  Start\[🎯 Usuário envia pedido de conteúdo\] \--\> CheckCredits{💰 Créditos suficientes?}  
  CheckCredits \-- Não \--\> Error\[❌ Retorna erro: saldo insuficiente\]  
  CheckCredits \-- Sim \--\> CallAI\[⚙️ Chamada OpenAI com parâmetros\]  
  CallAI \--\> SaveContent\[💾 Salva conteúdo no Supabase\]  
  SaveContent \--\> DeductCredit\[📉 Decrementa 1 crédito\]  
  DeductCredit \--\> ReturnContent\[📤 Retorna conteúdo ao frontend\]

---

## **📚 Fluxo de Histórico e Ações**

flowchart TD  
  UserDashboard\[📋 Painel do Usuário\] \--\> ViewHistory\[📚 Listar Conteúdos\]  
  ViewHistory \--\> CardClick\[👁 Ver conteúdo individual\]  
  CardClick \--\> Options{🔧 Ações disponíveis}  
  Options \--\>|Copiar| Copy\[📋 Copiar para área de transferência\]  
  Options \--\>|Excluir| Delete\[🗑 Confirma exclusão\]  
  Delete \--\> ConfirmModal\[🛑 Modal de Confirmação\]  
  ConfirmModal \--\>|Sim| DeleteContent\[🧹 Remove do Supabase\]

---

## **📊 Fluxo de Métricas e Análise**

flowchart TD  
  LoadDashboard\[📊 Dashboard carregado\] \--\> FetchMetrics\[🔍 Busca métricas no Supabase\]  
  FetchMetrics \--\> ShowCredits\[💰 Créditos restantes\]  
  FetchMetrics \--\> ShowContentCount\[📝 Total de conteúdos gerados\]  
  FetchMetrics \--\> ShowExportRate\[📤 Taxa de exportação\]  
  FetchMetrics \--\> ShowEngagement\[📈 Simulação de engajamento médio\]

---

## **🧭 Fluxo de Onboarding (Wizard)**

flowchart TD  
  Step1\[Etapa 1: Nicho\] \--\> Step2\[Etapa 2: Persona alvo\]  
  Step2 \--\> Step3\[Etapa 3: Canais de publicação\]  
  Step3 \--\> Step4\[📥 Enviar para Supabase\]  
  Step4 \--\> Redirect\[✅ Redirecionar para Dashboard\]

---

## **🧰 Integração com N8N (Agendamento Futuro)**

flowchart TD  
  UserAction\[⏱ Agendar conteúdo\] \--\> SaveSchedule\[💾 Salvar agendamento no Supabase\]  
  SaveSchedule \--\> TriggerN8N\[📡 Disparar Webhook para N8N\]  
  TriggerN8N \--\> N8NFlow\[🤖 N8N executa fluxo\]  
  N8NFlow \--\> PublishContent\[📲 Postagem em rede social\]  
  PublishContent \--\> LogResult\[📝 Loga status e erro no Supabase\]

