import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
});

// User profiles table
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  businessType: text("business_type"),
  targetPersona: text("target_persona"),
  channels: text("channels").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  userId: true,
  businessType: true,
  targetPersona: true,
  channels: true,
});

// Content types enum
export const ContentType = {
  INSTAGRAM_POST: "INSTAGRAM_POST",
  BLOG_ARTICLE: "BLOG_ARTICLE",
  FACEBOOK_AD: "FACEBOOK_AD",
} as const;

export type ContentTypeEnum = typeof ContentType[keyof typeof ContentType];

// Content table
export const contents = pgTable("content_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  tone: text("tone"),
  objective: text("objective"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(contents).pick({
  userId: true,
  type: true,
  title: true,
  body: true,
  tone: true,
  objective: true,
  status: true,
});

// Credits table
export const credits = pgTable("credits", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: integer("amount").notNull(),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCreditSchema = createInsertSchema(credits).pick({
  userId: true,
  amount: true,
  source: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type Content = typeof contents.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

export type Credit = typeof credits.$inferSelect;
export type InsertCredit = z.infer<typeof insertCreditSchema>;

// Schema for onboarding form
export const onboardingSchema = z.object({
  businessType: z.string().min(1, { message: "Selecione o nicho de atuação" }),
  targetPersona: z.string().min(1, { message: "Descreva sua persona alvo" }),
  channels: z.array(z.string()).min(1, { message: "Selecione pelo menos um canal" }),
});

// Schema for content generation form
export const contentGenerationSchema = z.object({
  type: z.string().min(1, { message: "Selecione o tipo de conteúdo" }),
  objective: z.string().min(1, { message: "Selecione o objetivo" }),
  tone: z.string().min(1, { message: "Selecione o tom de voz" }),
  theme: z.string().min(1, { message: "Digite o tema ou título" }),
});
