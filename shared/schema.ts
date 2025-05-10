import { z } from "zod";
// Importar ContentType diretamente do Prisma client para garantir consistência
import { ContentType as PrismaContentTypeEnum } from '@prisma/client';

// Helper para criar um Zod enum a partir do enum do Prisma
const contentTypeZodEnum = z.nativeEnum(PrismaContentTypeEnum);

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
  type: contentTypeZodEnum, // Usa o Zod enum derivado do Prisma enum
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
  type: contentTypeZodEnum,
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

// Não precisamos mais exportar tipos como User, UserProfile, etc., daqui,
// pois eles devem ser importados de '@prisma/client' em toda a aplicação.
// As definições do Drizzle (pgTable, etc.) devem ser completamente removidas deste arquivo.
