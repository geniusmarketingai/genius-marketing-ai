\# 📦 Genius Marketing AI – Prisma Schema \+ Supabase RLS

\> Documento para uso com agentes MCP \+ Cursor AI

\---

\#\# ✅ Stack & Objetivo

Este documento define a estrutura de banco de dados do projeto \*\*Genius Marketing AI\*\* usando:

\- \*\*Prisma ORM\*\*

\- \*\*Supabase (PostgreSQL)\*\* com \*\*RLS\*\* (Row Level Security)

\- Automação via \*\*Cursor AI\*\* com \*\*MCP (Migration Control Plane)\*\*

\---

\#\# 📐 Prisma Schema

\`\`\`prisma

generator client {

  provider \= "prisma-client-js"

}

datasource db {

  provider \= "postgresql"

  url      \= env("DATABASE\_URL")

}

model UserProfile {

  id             String   @id @default(uuid())

  userId         String   @unique

  email          String   @unique

  name           String?

  businessType   String?

  targetPersona  String?

  channels       String\[\]

  createdAt      DateTime @default(now())

  updatedAt      DateTime @updatedAt

  user           User     @relation(fields: \[userId\], references: \[id\])

  contents       Content\[\]

  credits        Credit\[\]

  @@map("user\_profile")

}

model Content {

  id          String   @id @default(uuid())

  userId      String

  type        ContentType

  title       String?

  body        String

  tone        String?

  objective   String?

  status      String

  createdAt   DateTime  @default(now())

  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: \[userId\], references: \[id\])

  @@index(\[userId\])

  @@map("content\_history")

}

model Credit {

  id         String   @id @default(uuid())

  userId     String

  amount     Int

  source     String?

  createdAt  DateTime @default(now())

  user       User     @relation(fields: \[userId\], references: \[id\])

  @@map("credits")

}

enum ContentType {

  INSTAGRAM\_POST

  BLOG\_ARTICLE

  FACEBOOK\_AD

  EMAIL\_COPY

  CTA\_COPY

}

model User {

  id        String       @id

  email     String       @unique

  createdAt DateTime     @default(now())

  updatedAt DateTime     @updatedAt

  profile   UserProfile?

  contents  Content\[\]

  credits   Credit\[\]

  @@map("users")

}

## **🔒 RLS – Row Level Security no Supabase**

### **🛠️ Passos para cada tabela com `userId`**

#### **1\. Habilite o RLS nas tabelas**

ALTER TABLE public.content\_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user\_profile ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;

#### **2\. Crie políticas por `auth.uid()`**

\-- Policy para content\_history

CREATE POLICY "Users can access their own content"

ON public.content\_history

FOR ALL

USING (user\_id \= auth.uid())

WITH CHECK (user\_id \= auth.uid());

\-- Policy para user\_profile

CREATE POLICY "Users manage their profile"

ON public.user\_profile

FOR ALL

USING (user\_id \= auth.uid())

WITH CHECK (user\_id \= auth.uid());

\-- Policy para credits

CREATE POLICY "Users see their own credits"

ON public.credits

FOR ALL

USING (user\_id \= auth.uid())

WITH CHECK (user\_id \= auth.uid());

## **⚙️ Orientação para agentes IA via MCP do Supabase**

### **📌 Instruções claras para execução**

1. Use o schema Prisma acima como referência base.

2. Crie as tabelas exatamente conforme especificadas no Supabase.

3. Ative **Row Level Security** em cada tabela com `userId`.

4. Crie as **políticas com `auth.uid()`** usando `USING` e `WITH CHECK`.

5. Respeite os nomes mapeados com `@@map`.

## **🧠 Prompt sugerido para Cursor AI**

Crie a estrutura Prisma \+ Supabase conforme schema fornecido.

Habilite RLS para todas as tabelas com userId.

Aplique políticas com auth.uid().

Use @@map conforme definido.

Não utilize banco local. Target: Supabase \+ Prisma.