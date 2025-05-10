import { z } from "zod";
// REMOVIDO: import { ContentType as PrismaContentTypeEnum } from '@prisma/client';

// Adicionada definição local do enum ContentType com base no schema.prisma
export const ContentTypeEnum = z.enum([
  "INSTAGRAM_POST",
  "BLOG_ARTICLE",
  "FACEBOOK_AD",
  "EMAIL_COPY",
  "CTA_COPY"
]);

// Helper foi removido pois ContentTypeEnum já é um Zod enum.
// const contentTypeZodEnum = z.nativeEnum(PrismaContentTypeEnum); // REMOVIDO

// Schema para UserProfile (usado para criação no onboarding)
// Prisma.UserProfileUncheckedCreateInput requer userId e email.
export const onboardingSchema = z.object({
  userId: z.string().min(1, "User ID é obrigatório"),
  email: z.string().email("Email inválido"),
  name: z.string().optional(), // Ou .min(1) se nome for obrigatório no onboarding
  businessType: z.string().min(1, { message: "Selecione o nicho de atuação" }),
  targetPersona: z.string().min(1, { message: "Descreva sua persona alvo" }),
  channels: z.array(z.string()).min(1, { message: "Selecione pelo menos um canal" }),
});
export type OnboardingData = z.infer<typeof onboardingSchema>;

// Schema para criar conteúdo (o que vai para storage.saveContent)
// Alinhado com Prisma.ContentUncheckedCreateInput
export const insertContentSchema = z.object({
  userId: z.string().min(1, "User ID é obrigatório"),
  type: ContentTypeEnum, // ATUALIZADO para usar ContentTypeEnum local
  title: z.string().optional(),
  body: z.string().min(1, "Corpo do conteúdo é obrigatório"),
  tone: z.string().optional(),
  objective: z.string().optional(),
  status: z.string().optional().default("active"), // Prisma model tem status: String
});
export type InsertContentData = z.infer<typeof insertContentSchema>;

// Schema para o formulário de geração de conteúdo no frontend
// Este pode ser um pouco diferente do insertContentSchema se o formulário coleta dados de forma diferente
// e depois são transformados.
export const contentGenerationSchema = z.object({
  userId: z.string().min(1, "User ID é obrigatório para geração"), // Adicionado userId aqui
  type: ContentTypeEnum, // ATUALIZADO para usar ContentTypeEnum local
  objective: z.string().min(1, { message: "Selecione o objetivo" }),
  tone: z.string().min(1, { message: "Selecione o tom de voz" }),
  theme: z.string().min(1, { message: "Digite o tema ou título" }), // 'theme' pode ser usado para gerar o 'title' e/ou 'body'
});
export type ContentGenerationUIData = z.infer<typeof contentGenerationSchema>;


// Schema para adicionar créditos (alinhado com o que updateUserCredits espera)
export const insertCreditSchema = z.object({
  userId: z.string().min(1, "User ID é obrigatório"),
  amount: z.number().int("Quantidade deve ser um número inteiro"),
  source: z.string().optional(),
});
export type InsertCreditData = z.infer<typeof insertCreditSchema>;

// Schema para registrar/sincronizar usuário da Supabase Auth com a tabela local 'users'
export const userRegistrationSchema = z.object({
  id: z.string().min(1, "User ID (Supabase Auth UID) é obrigatório"),
  email: z.string().email("Email inválido"),
  // Adicione aqui outros campos que você pode querer passar do frontend 
  // ou que sejam obrigatórios na sua tabela `users` e não tenham default no Prisma.
});
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

// Não precisamos mais exportar tipos como User, UserProfile, etc., daqui,
// pois eles devem ser importados de '@prisma/client' em toda a aplicação.
// As definições do Drizzle (pgTable, etc.) devem ser completamente removidas deste arquivo.
