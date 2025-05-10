import type {
  User, InsertUser,
  UserProfile, InsertUserProfile,
  Content, InsertContent,
  Credit, InsertCredit, // Mantido para completude da referência de tipos
  ContentType
} from '../../shared/schema'; // Ajustado o caminho
import { PrismaStorage } from './prisma-storage'; // Importa a nova implementação Prisma

// Interface IStorage atualizada para Content.id ser string
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User Profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  saveUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  // Content operations
  getContent(id: string): Promise<Content | undefined>; // ID do conteúdo agora é string (UUID)
  getUserContents(userId: string, type?: string): Promise<Content[]>;
  saveContent(content: InsertContent): Promise<Content>;
  deleteContent(id: string): Promise<void>; // ID do conteúdo agora é string (UUID)
  getContentCount(userId: string): Promise<number>;
  getContentTypeDistribution(userId: string): Promise<{type: string, count: number}[]>;
  
  // Credits operations
  getUserCredits(userId: string): Promise<{amount: number} | undefined>;
  updateUserCredits(userId: string, amount: number, source: string): Promise<{amount: number}>;
}

// MemStorage atualizado para Content.id ser string (UUID)
// Para consistência, MemStorage agora usará strings para content IDs também,
// embora internamente possa precisar de uma forma de gerar esses UUIDs ou usar um contador simples e converter para string.
// Por simplicidade, vamos manter um contador numérico e convertê-lo para string para o ID.
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>; // userId (string) como chave
  private contents: Map<string, Content>; // contentId (string UUID) como chave
  private credits: Map<string, number>; // userId (string) como chave para o total de créditos
  
  private contentIdCounter: number;
  private profileIdCounter: number; // Para IDs de UserProfile, que também são UUIDs no Prisma

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.contents = new Map();
    this.credits = new Map();
    this.contentIdCounter = 1;
    this.profileIdCounter = 1;
  }

  // Helper para gerar UUIDs simples (para MemStorage, não criptograficamente seguro)
  private generateUUID(): string {
    // Simples contador para simular UUID em MemStorage, para fins de teste.
    // Em uma implementação mais robusta de MemStorage para testes, poderia usar uma lib de UUID.
    return `mem-uuid-${this.contentIdCounter++}`;
  }
  private generateProfileUUID(): string {
    return `mem-profile-uuid-${this.profileIdCounter++}`;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      createdAt: now, 
      updatedAt: now 
    };
    this.users.set(user.id, user);
    return user;
  }
  
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(userId);
  }

  async saveUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const now = new Date();
    const id = this.generateProfileUUID(); // Gerar UUID para UserProfile
    const newProfile: UserProfile = {
      id,
      userId: profile.userId,
      email: profile.email, // Adicionando email conforme schema UserProfile
      name: profile.name || null,
      businessType: profile.businessType || null,
      targetPersona: profile.targetPersona || null,
      channels: profile.channels || [],
      createdAt: now,
      updatedAt: now
    };
    this.userProfiles.set(profile.userId, newProfile);
    return newProfile;
  }

  async updateUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const existingProfile = this.userProfiles.get(profile.userId);
    if (!existingProfile) {
      // Se o perfil não existe, o schema Prisma faria um upsert ou erro.
      // Para MemStorage, vamos criar um novo se não existir, similar ao save.
      return this.saveUserProfile(profile);
    }
    const now = new Date();
    const updatedProfile: UserProfile = {
      ...existingProfile,
      name: profile.name !== undefined ? profile.name : existingProfile.name,
      email: profile.email !== undefined ? profile.email : existingProfile.email,
      businessType: profile.businessType !== undefined ? profile.businessType : existingProfile.businessType,
      targetPersona: profile.targetPersona !== undefined ? profile.targetPersona : existingProfile.targetPersona,
      channels: profile.channels !== undefined ? profile.channels : existingProfile.channels,
      updatedAt: now
    };
    this.userProfiles.set(profile.userId, updatedProfile);
    return updatedProfile;
  }
  
  async getContent(id: string): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async getUserContents(userId: string, type?: string): Promise<Content[]> {
    let userContents = Array.from(this.contents.values()).filter(
      (content) => content.userId === userId
    );
    if (type) {
      userContents = userContents.filter(content => content.type === type as ContentType);
    }
    return userContents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async saveContent(content: InsertContent): Promise<Content> {
    const now = new Date();
    const id = this.generateUUID(); // Gerar UUID para Content
    const newContent: Content = {
      id,
      userId: content.userId,
      type: content.type as ContentType,
      body: content.body,
      title: content.title || null,
      tone: content.tone || null,
      objective: content.objective || null,
      status: content.status || 'active',
      createdAt: now,
      updatedAt: now
    };
    this.contents.set(id, newContent);
    return newContent;
  }

  async deleteContent(id: string): Promise<void> {
    this.contents.delete(id);
  }

  async getContentCount(userId: string): Promise<number> {
    return Array.from(this.contents.values()).filter(c => c.userId === userId).length;
  }

  async getContentTypeDistribution(userId: string): Promise<{type: string, count: number}[]> {
    const userContents = Array.from(this.contents.values()).filter(c => c.userId === userId);
    const distribution = new Map<string, number>();
    userContents.forEach(content => {
      const currentCount = distribution.get(content.type) || 0;
      distribution.set(content.type, currentCount + 1);
    });
    return Array.from(distribution.entries()).map(([type, count]) => ({ type, count }));
  }
  
  async getUserCredits(userId: string): Promise<{amount: number} | undefined> {
    const amount = this.credits.get(userId);
    return amount !== undefined ? { amount } : undefined;
  }

  async updateUserCredits(userId: string, amountChange: number, source: string): Promise<{amount: number}> {
    // Em MemStorage, vamos simular a criação de um registro de crédito e atualizar um total.
    // A interface espera o novo total.
    const currentAmount = this.credits.get(userId) || 0;
    const newTotalAmount = currentAmount + amountChange;
    this.credits.set(userId, newTotalAmount);
    // A implementação Prisma cria um novo registro de crédito, e depois recalcula o total.
    // Para MemStorage, apenas atualizamos o total agregado.
    return { amount: newTotalAmount };
  }
}

// Use PrismaStorage when DATABASE_URL is available, otherwise fallback to in-memory storage
export const storage: IStorage = process.env.DATABASE_URL 
  ? new PrismaStorage() 
  : new MemStorage(); 