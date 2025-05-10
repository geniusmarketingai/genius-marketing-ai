import type { Express } from "express";
// Removido: import { createServer, type Server } from "http"; // Não precisamos criar o servidor HTTP aqui
import { storage } from "./storage"; // Assumindo que storage.ts estará em api/_lib/storage.ts
import { z } from "zod";
import { insertContentSchema, insertCreditSchema, onboardingSchema } from "../../shared/schema"; // Ajustado o caminho
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

// A função agora apenas registra rotas, não retorna um Server
export function registerRoutes(app: Express): void { 
  // API routes prefix with /api
  
  // Profile endpoints
  app.get("/api/profile", async (req, res) => {
    try {
      // In a real app, this would come from the session token
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const profile = await storage.getUserProfile(userId);
      return res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const result = onboardingSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Dados de perfil inválidos", errors: result.error.format() });
      }
      
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const profile = await storage.saveUserProfile({
        userId,
        businessType: result.data.businessType,
        targetPersona: result.data.targetPersona,
        channels: result.data.channels,
      });
      
      return res.json(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      return res.status(500).json({ message: "Erro ao salvar perfil" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const result = onboardingSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Dados de perfil inválidos", errors: result.error.format() });
      }
      
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const profile = await storage.updateUserProfile({
        userId,
        businessType: result.data.businessType,
        targetPersona: result.data.targetPersona,
        channels: result.data.channels,
      });
      
      return res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  // Content generation endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const { userId, type, objective, tone, theme } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Check if user has credits
      const userCredits = await storage.getUserCredits(userId);
      if (!userCredits || userCredits.amount <= 0) {
        return res.status(403).json({ message: "Créditos insuficientes" });
      }
      
      // Get user profile for context
      const userProfile = await storage.getUserProfile(userId);
      
      // Build prompt for OpenAI
      let prompt = `Gere um ${type === 'INSTAGRAM_POST' ? 'post para Instagram' : 
                    type === 'BLOG_ARTICLE' ? 'artigo para blog' : 
                    'anúncio para Facebook'} em português brasileiro.`;
      
      prompt += `\nTema: ${theme}`;
      prompt += `\nObjetivo: ${objective}`;
      prompt += `\nTom de voz: ${tone}`;
      
      if (userProfile) {
        prompt += `\nNicho de atuação: ${userProfile.businessType || ''}`;
        prompt += `\nPersona alvo: ${userProfile.targetPersona || ''}`;
      }
      
      // Add content type specific instructions
      if (type === 'INSTAGRAM_POST') {
        prompt += `\nFormate como um post de Instagram com emojis, hashtags e chamada para ação.`;
      } else if (type === 'BLOG_ARTICLE') {
        prompt += `\nCrie um artigo de blog com introdução, desenvolvimento em tópicos, e conclusão. Otimize para SEO.`;
      } else if (type === 'FACEBOOK_AD') {
        prompt += `\nCrie um anúncio persuasivo para Facebook com título atrativo, descrição clara e call-to-action forte.`;
      }
      
      // Get response from OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "Você é um especialista em marketing digital brasileiro. Crie conteúdo original, persuasivo e otimizado para o canal solicitado."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
      });
      
      const generatedContent = completion.choices[0].message.content;
      
      // Extract a title from the content if none was provided
      let title = theme;
      if (generatedContent && !title) {
        const lines = generatedContent.split('\n');
        title = lines[0].replace(/^#+ /, '').slice(0, 100);
      }
      
      // Save content to history
      const content = await storage.saveContent({
        userId,
        type,
        title,
        body: generatedContent || "",
        tone,
        objective,
        status: "active",
      });
      
      // Deduct one credit
      await storage.updateUserCredits(userId, -1, "generation");
      
      return res.json({ 
        content,
        generatedContent
      });
    } catch (error) {
      console.error("Error generating content:", error);
      return res.status(500).json({ message: "Erro ao gerar conteúdo" });
    }
  });

  // Content history endpoint
  app.get("/api/history", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const type = req.query.type as string;
      
      const contents = await storage.getUserContents(userId, type);
      return res.json(contents);
    } catch (error) {
      console.error("Error fetching content history:", error);
      return res.status(500).json({ message: "Erro ao buscar histórico" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const content = await storage.getContent(contentId);
      
      if (!content) {
        return res.status(404).json({ message: "Conteúdo não encontrado" });
      }
      
      if (content.userId !== userId) {
        return res.status(403).json({ message: "Não autorizado a excluir este conteúdo" });
      }
      
      await storage.deleteContent(contentId);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content:", error);
      return res.status(500).json({ message: "Erro ao excluir conteúdo" });
    }
  });

  // Credits endpoints
  app.get("/api/credits", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const credits = await storage.getUserCredits(userId);
      return res.json(credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
      return res.status(500).json({ message: "Erro ao buscar créditos" });
    }
  });

  app.post("/api/credits/add", async (req, res) => {
    try {
      const { userId, amount, source } = req.body;
      
      // In a real app, this would have admin authorization checks
      if (!userId || !amount) {
        return res.status(400).json({ message: "Dados inválidos" });
      }
      
      const credits = await storage.updateUserCredits(userId, amount, source || "admin");
      return res.json(credits);
    } catch (error) {
      console.error("Error adding credits:", error);
      return res.status(500).json({ message: "Erro ao adicionar créditos" });
    }
  });

  // Health check endpoint (optional, but good for Vercel)
  app.get("/api/health", (req, res) => {
    res.status(200).send("OK");
  });
} 