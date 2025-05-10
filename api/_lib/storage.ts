import { User, UserProfile, Content, Credit, ContentType, Prisma } from '@prisma/client';
import { PrismaStorage } from './prisma-storage';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: Prisma.UserCreateInput): Promise<User>;
  
  // User Profile operations
  getUserProfile(userId: string): Promise<UserProfile | null>;
  saveUserProfile(data: Prisma.UserProfileUncheckedCreateInput): Promise<UserProfile>;
  updateUserProfile(userId: string, data: Prisma.UserProfileUncheckedUpdateInput): Promise<UserProfile>;
  
  // Content operations
  getContent(id: string): Promise<Content | null>;
  getUserContents(userId: string, type?: ContentType): Promise<Content[]>;
  saveContent(data: Prisma.ContentUncheckedCreateInput): Promise<Content>;
  deleteContent(id: string): Promise<void>;
  getContentCount(userId: string): Promise<number>;
  getContentTypeDistribution(userId: string): Promise<{type: ContentType, count: number}[]>;
  
  // Credits operations
  getUserCredits(userId: string): Promise<{amount: number} | null>;
  updateUserCredits(userId: string, amountChange: number, source: string): Promise<{amount: number}>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private contents: Map<string, Content>;
  private creditsData: Map<string, Credit[]>;
  
  private idCounter: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.contents = new Map();
    this.creditsData = new Map();
    this.idCounter = 1;
  }

  private generateUUID(): string {
    return `mem-uuid-${this.idCounter++}`;
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const now = new Date();
    const newUser: User = {
      id: data.id || this.generateUUID(),
      email: data.email,
      createdAt: data.createdAt instanceof Date ? data.createdAt : now,
      updatedAt: data.updatedAt instanceof Date ? data.updatedAt : now,
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }
  
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.userProfiles.get(userId) || null;
  }

  async saveUserProfile(data: Prisma.UserProfileUncheckedCreateInput): Promise<UserProfile> {
    const now = new Date();
    const newProfile: UserProfile = {
      id: this.generateUUID(),
      userId: data.userId,
      email: data.email,
      name: data.name || null,
      businessType: data.businessType || null,
      targetPersona: data.targetPersona || null,
      channels: data.channels as string[] || [],
      createdAt: now,
      updatedAt: now,
    };
    this.userProfiles.set(data.userId, newProfile);
    return newProfile;
  }

  async updateUserProfile(userId: string, data: Prisma.UserProfileUncheckedUpdateInput): Promise<UserProfile> {
    const existingProfile = this.userProfiles.get(userId);
    if (!existingProfile) {
      throw new Error("Profile not found for update.");
    }
    const now = new Date();
    const updatedProfile: UserProfile = { ...existingProfile };
    if (data.email) updatedProfile.email = data.email as string;
    if (data.name) updatedProfile.name = data.name as string | null;
    if (data.businessType) updatedProfile.businessType = data.businessType as string | null;
    if (data.targetPersona) updatedProfile.targetPersona = data.targetPersona as string | null;
    if (data.channels) updatedProfile.channels = data.channels as string[];
    updatedProfile.updatedAt = now;

    this.userProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }
  
  async getContent(id: string): Promise<Content | null> {
    return this.contents.get(id) || null;
  }

  async getUserContents(userId: string, type?: ContentType): Promise<Content[]> {
    let userContents = Array.from(this.contents.values()).filter(
      (content) => content.userId === userId
    );
    if (type) {
      userContents = userContents.filter(content => content.type === type);
    }
    return userContents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async saveContent(data: Prisma.ContentUncheckedCreateInput): Promise<Content> {
    const now = new Date();
    const newContent: Content = {
      id: this.generateUUID(),
      userId: data.userId,
      type: data.type,
      title: data.title || null,
      body: data.body,
      tone: data.tone || null,
      objective: data.objective || null,
      status: data.status || 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.contents.set(newContent.id, newContent);
    return newContent;
  }

  async deleteContent(id: string): Promise<void> {
    this.contents.delete(id);
  }

  async getContentCount(userId: string): Promise<number> {
    return Array.from(this.contents.values()).filter(c => c.userId === userId).length;
  }

  async getContentTypeDistribution(userId: string): Promise<{type: ContentType, count: number}[]> {
    const userContents = Array.from(this.contents.values()).filter(c => c.userId === userId);
    const distribution = new Map<ContentType, number>();
    userContents.forEach(content => {
      const currentCount = distribution.get(content.type) || 0;
      distribution.set(content.type, currentCount + 1);
    });
    return Array.from(distribution.entries()).map(([type, count]) => ({ type, count }));
  }
  
  async getUserCredits(userId: string): Promise<{amount: number} | null> {
    const userCreditRecords = this.creditsData.get(userId) || [];
    if (userCreditRecords.length === 0) return null;
    const totalAmount = userCreditRecords.reduce((sum, credit) => sum + credit.amount, 0);
    return { amount: totalAmount };
  }

  async updateUserCredits(userId: string, amountChange: number, source: string): Promise<{amount: number}> {
    const now = new Date();
    const newCreditRecord: Credit = {
      id: this.generateUUID(),
      userId,
      amount: amountChange,
      source: source || null,
      createdAt: now,
    };
    const userCreditRecords = this.creditsData.get(userId) || [];
    userCreditRecords.push(newCreditRecord);
    this.creditsData.set(userId, userCreditRecords);

    const currentTotal = await this.getUserCredits(userId);
    return { amount: currentTotal?.amount ?? 0 }; 
  }
}

export const storage: IStorage = process.env.DATABASE_URL 
  ? new PrismaStorage() 
  : new MemStorage(); 