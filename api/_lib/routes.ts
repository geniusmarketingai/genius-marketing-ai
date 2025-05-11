import type { Express } from "express";
// Removido: import { createServer, type Server } from "http"; // Não precisamos criar o servidor HTTP aqui
import { storage } from "./storage.js"; // ADICIONADO .js
import { z } from "zod";
import { insertContentSchema, insertCreditSchema, onboardingSchema, contentGenerationSchema, userRegistrationSchema } from "../../shared/schema.js"; // ADICIONADO .js
import OpenAI from "openai";
// Importar ContentType do Prisma para uso explícito se necessário
import { ContentType } from '@prisma/client';
// Importar Prisma para error handling específico
import { Prisma } from '@prisma/client'; 

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

// A função agora apenas registra rotas, não retorna um Server
export function registerRoutes(app: Express): void { 
  // API routes prefix with /api
  
  // Rota para registrar/sincronizar usuário
  app.post("/api/user", async (req, res) => {
    try {
      const parseResult = userRegistrationSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Dados de registro de usuário inválidos", 
          errors: parseResult.error.format() 
        });
      }
      
      const { id, email } = parseResult.data;

      // A função storage.findOrCreateUser receberá os dados validados
      const user = await storage.findOrCreateUser({ id, email }); 
      
      // Retorna 200 tanto se encontrou quanto se criou, com os dados do usuário.
      // O frontend pode não precisar diferenciar, apenas saber que o usuário existe no sistema.
      return res.status(200).json(user); 
    } catch (error: any) {
      console.error("[API Error] /api/user:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Tratar erros conhecidos do Prisma se necessário, embora findOrCreateUser deva ser robusto
        // Ex: P2002 para unique constraint, embora a lógica de findOrCreate deva evitar isso para 'id' e 'email' primários.
        return res.status(500).json({ 
          message: `Erro de banco de dados ao registrar usuário: ${error.code}`,
          code: error.code
        });
      }
      return res.status(500).json({ message: "Erro interno do servidor ao registrar usuário" });
    }
  });

  // Profile endpoints
  app.get("/api/profile", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        // Se o userId é um parâmetro de query obrigatório
        return res.status(400).json({ message: "userId é obrigatório como query parameter" });
      }
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }
      return res.json(profile);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json({ 
          message: `Erro de banco de dados ao buscar perfil: ${error.code}`,
          code: error.code
        });
      }
      return res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    let profileInput: any; // Para uso no logging do catch
    try {
      const parseResult = onboardingSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Dados de perfil inválidos", errors: parseResult.error.format() });
      }
      const { userId, email, ...profileData } = parseResult.data;

      if (!userId || !email) {
        return res.status(400).json({ message: "userId e email são obrigatórios para o perfil" });
      }

      profileInput = { // Atribuído aqui
        userId,
        email,
        name: profileData.name,
        businessType: profileData.businessType,
        targetPersona: profileData.targetPersona,
        channels: profileData.channels,
      };

      // A função storage.saveUserProfile AINDA é o ponto que precisa da lógica de upsert
      const profile = await storage.saveUserProfile(profileInput);
      return res.status(201).json(profile);
    } catch (error: any) { // Tipagem básica
      console.error("Error saving profile:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') { // Unique constraint violation
          console.warn(`Tentativa de criar perfil duplicado. UserID: ${profileInput?.userId}, Email: ${profileInput?.email}. Erro P2002. Meta: ${JSON.stringify(error.meta)}`);
          return res.status(409).json({
            message: "Falha ao salvar perfil: Um perfil com este ID de usuário ou e-mail já existe.",
            code: error.code,
            target: error.meta?.target
          });
        }
        // Outros erros conhecidos do Prisma
        return res.status(500).json({
          message: `Erro de banco de dados ao salvar perfil: ${error.code}`,
          code: error.code
        });
      }
      // Erros genéricos
      return res.status(500).json({ message: "Erro interno do servidor ao salvar perfil" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const userIdFromParams = req.query.userId as string;
      if (!userIdFromParams) {
        return res.status(400).json({ message: "userId é obrigatório para atualizar o perfil" });
      }

      const parseResult = onboardingSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Dados de perfil inválidos", errors: parseResult.error.format() });
      }
      
      // Não permitir atualização de userId ou email via este endpoint se for o caso.
      // Prisma.UserProfileUncheckedUpdateInput aceita campos opcionais.
      const { userId, email, ...updateData } = parseResult.data;
      
      // Se userId e email no corpo devem ser ignorados para o update, não os inclua no objeto de dados.
      // O userId para a cláusula WHERE vem de userIdFromParams.
      const profileUpdateData = {
        name: updateData.name,
        businessType: updateData.businessType,
        targetPersona: updateData.targetPersona,
        channels: updateData.channels,
      };

      const profile = await storage.updateUserProfile(userIdFromParams, profileUpdateData);
      if (!profile) { 
          return res.status(404).json({ message: "Perfil não encontrado para atualização." });
      }
      return res.json(profile);
    } catch (error: any) { 
      console.error("Error updating profile:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { 
          return res.status(404).json({
            message: `Perfil não encontrado para atualização: ${(error.meta?.cause as string) || 'ID não existe.'}`,
            code: error.code
          });
        }
        return res.status(500).json({
          message: `Erro de banco de dados ao atualizar perfil: ${error.code}`,
          code: error.code
        });
      }
      return res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  // Content generation endpoint
  app.post("/api/generate", async (req, res) => {
    let finalValidation: any; // Para uso no catch
    try {
      const parseResult = contentGenerationSchema.safeParse(req.body);
      if(!parseResult.success) {
        return res.status(400).json({ message: "Dados para geração inválidos", errors: parseResult.error.format() });
      }
      const { userId, type, objective, tone, theme } = parseResult.data;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userCredits = await storage.getUserCredits(userId);
      if (!userCredits || userCredits.amount <= 0) {
        return res.status(403).json({ message: "Créditos insuficientes" });
      }
      
      const userProfile = await storage.getUserProfile(userId);
      
      let prompt = `Gere um ${type === ContentType.INSTAGRAM_POST ? 'post para Instagram' : 
                    type === ContentType.BLOG_ARTICLE ? 'artigo para blog' : 
                    type === ContentType.FACEBOOK_AD ? 'anúncio para Facebook' : 
                    type === ContentType.EMAIL_COPY ? 'cópia de e-mail' : 
                    type === ContentType.CTA_COPY ? 'cópia de CTA' : 
                    'conteúdo'} em português brasileiro.`;
      
      prompt += `\nTema: ${theme}`;
      prompt += `\nObjetivo: ${objective}`;
      prompt += `\nTom de voz: ${tone}`;
      
      if (userProfile) {
        prompt += `\nNicho de atuação: ${userProfile.businessType || ''}`;
        prompt += `\nPersona alvo: ${userProfile.targetPersona || ''}`;
      }
      
      if (type === ContentType.INSTAGRAM_POST) {
        prompt += `\nFormate como um post de Instagram com emojis, hashtags e chamada para ação.`;
      } else if (type === ContentType.BLOG_ARTICLE) {
        prompt += `\nCrie um artigo de blog com introdução, desenvolvimento em tópicos, e conclusão. Otimize para SEO.`;
      } else if (type === ContentType.FACEBOOK_AD) {
        prompt += `\nCrie um anúncio persuasivo para Facebook com título atrativo, descrição clara e call-to-action forte.`;
      } // Adicionar mais `else if` para EMAIL_COPY e CTA_COPY se necessário
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
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
      
      const generatedContentText = completion.choices[0].message.content;
      
      let generatedTitle = theme; // Usar 'theme' como base para o título
      if (generatedContentText && !generatedTitle) {
        const lines = generatedContentText.split('\n');
        generatedTitle = lines[0].replace(/^#+ /, '').slice(0, 100);
      }
      
      // contentToSave usará os campos de insertContentSchema
      const contentToSave = {
        userId,
        type, // type vem de contentGenerationSchema, que usa o mesmo ContentTypeEnum
        title: generatedTitle || "Conteúdo Gerado",
        body: generatedContentText || "",
        tone, // tone vem de contentGenerationSchema
        objective, // objective vem de contentGenerationSchema
        status: "active",
      };

      finalValidation = insertContentSchema.safeParse(contentToSave);
      if (!finalValidation.success) {
        console.error("Erro de validação interna antes de salvar:", finalValidation.error.format());
        return res.status(500).json({ message: "Erro interno ao preparar dados para salvar."});
      }

      const savedContent = await storage.saveContent(finalValidation.data); // Salvar os dados validados
      await storage.updateUserCredits(userId, -1, "generation");
      
      return res.status(201).json({ 
        content: savedContent,
        generatedContent: generatedContentText // Manter este campo se o frontend o utiliza
      });
    } catch (error: any) { 
      console.error("Error generating content:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json({ 
          message: `Erro de banco de dados ao gerar conteúdo: ${error.code}`,
          code: error.code 
        });
      }
      if (error instanceof OpenAI.APIError) { // Tratamento de erro da API OpenAI
        return res.status(error.status || 500).json({ message: `Erro da API OpenAI: ${error.name}`, details: error.message });
      }
      return res.status(500).json({ message: "Erro ao gerar conteúdo" });
    }
  });

  // Content history endpoint
  app.get("/api/history", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const typeQuery = req.query.type as string;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Validar se typeQuery é um ContentType válido
      let contentTypeFilter: ContentType | undefined = undefined;
      if (typeQuery && Object.values(ContentType).includes(typeQuery as ContentType)) {
        contentTypeFilter = typeQuery as ContentType;
      }
      
      const contents = await storage.getUserContents(userId, contentTypeFilter);
      return res.json(contents);
    } catch (error: any) { 
      console.error("Error fetching content history:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json({ 
          message: `Erro de banco de dados ao buscar histórico: ${error.code}`,
          code: error.code 
        });
      }
      return res.status(500).json({ message: "Erro ao buscar histórico" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const contentId = req.params.id; // ID é string (UUID)
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!contentId) {
        return res.status(400).json({ message: "Content ID é obrigatório" });
      }
      
      const content = await storage.getContent(contentId);
      if (!content) {
        return res.status(404).json({ message: "Conteúdo não encontrado" });
      }
      if (content.userId !== userId) {
        return res.status(403).json({ message: "Não autorizado a excluir este conteúdo" });
      }
      
      await storage.deleteContent(contentId);
      return res.status(200).json({ success: true, message: "Conteúdo excluído" });
    } catch (error: any) { 
      console.error("Error deleting content:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { 
          return res.status(404).json({
            message: `Conteúdo não encontrado para exclusão: ${(error.meta?.cause as string) || 'ID não existe.'}`,
            code: error.code
          });
        }
        return res.status(500).json({ 
          message: `Erro de banco de dados ao excluir conteúdo: ${error.code}`,
          code: error.code 
        });
      }
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
      if (!credits) {
        // Se o usuário não tem registro de crédito, pode retornar 0 ou um status específico
        return res.json({ amount: 0 });
      }
      return res.json(credits);
    } catch (error: any) { 
      console.error("Error fetching credits:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json({ 
          message: `Erro de banco de dados ao buscar créditos: ${error.code}`,
          code: error.code 
        });
      }
      return res.status(500).json({ message: "Erro ao buscar créditos" });
    }
  });

  app.post("/api/credits/add", async (req, res) => {
    try {
      const parseResult = insertCreditSchema.safeParse(req.body);
      if(!parseResult.success){
        return res.status(400).json({ message: "Dados para crédito inválidos", errors: parseResult.error.format() });
      }
      const { userId, amount, source } = parseResult.data;
      
      if (!userId || amount === undefined) { // amount pode ser 0, então checar undefined
        return res.status(400).json({ message: "userId e amount são obrigatórios" });
      }
      
      const creditsData = await storage.updateUserCredits(userId, amount, source || "admin");
      return res.json(creditsData);
    } catch (error: any) { 
      console.error("Error adding credits:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json({ 
          message: `Erro de banco de dados ao adicionar créditos: ${error.code}`,
          code: error.code 
        });
      }
      return res.status(500).json({ message: "Erro ao adicionar créditos" });
    }
  });

  // Health check endpoint (optional, but good for Vercel)
  app.get("/api/health", (req, res) => {
    res.status(200).send("OK");
  });
} 