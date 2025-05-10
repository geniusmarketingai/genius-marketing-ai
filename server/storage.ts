import { users, type User, type InsertUser, userProfiles, type UserProfile, type InsertUserProfile, contents, type Content, type InsertContent, credits, type Credit, type InsertCredit } from "@shared/schema";

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
  getContent(id: number): Promise<Content | undefined>;
  getUserContents(userId: string, type?: string): Promise<Content[]>;
  saveContent(content: InsertContent): Promise<Content>;
  deleteContent(id: number): Promise<void>;
  getContentCount(userId: string): Promise<number>;
  getContentTypeDistribution(userId: string): Promise<{type: string, count: number}[]>;
  
  // Credits operations
  getUserCredits(userId: string): Promise<{amount: number} | undefined>;
  updateUserCredits(userId: string, amount: number, source: string): Promise<{amount: number}>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private contents: Map<number, Content>;
  private credits: Map<string, number>;
  private contentId: number;
  private profileId: number;
  private creditId: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.contents = new Map();
    this.credits = new Map();
    this.contentId = 1;
    this.profileId = 1;
    this.creditId = 1;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
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
  
  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async saveUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const now = new Date();
    const id = this.profileId++;
    const newProfile: UserProfile = {
      id,
      userId: profile.userId,
      businessType: profile.businessType || null,
      targetPersona: profile.targetPersona || null,
      channels: profile.channels || null,
      createdAt: now,
      updatedAt: now
    };
    this.userProfiles.set(profile.userId, newProfile);
    return newProfile;
  }

  async updateUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const existingProfile = await this.getUserProfile(profile.userId);
    
    if (!existingProfile) {
      return this.saveUserProfile(profile);
    }
    
    const now = new Date();
    const updatedProfile: UserProfile = {
      ...existingProfile,
      businessType: profile.businessType || existingProfile.businessType,
      targetPersona: profile.targetPersona || existingProfile.targetPersona,
      channels: profile.channels || existingProfile.channels,
      updatedAt: now
    };
    
    // For a Map with numeric keys, we need to use the string representation
    this.userProfiles.set(String(existingProfile.id), updatedProfile);
    return updatedProfile;
  }
  
  // Content operations
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async getUserContents(userId: string, type?: string): Promise<Content[]> {
    const userContents = Array.from(this.contents.values()).filter(
      (content) => content.userId === userId
    );
    
    if (type) {
      return userContents.filter(content => content.type === type)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    return userContents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async saveContent(content: InsertContent): Promise<Content> {
    try {
      const now = new Date();
      const id = this.contentId++;
      
      // Create a content object with default values
      const newContent = {
        id,
        userId: content.userId,
        type: content.type,
        body: content.body,
        title: content.title || null,
        tone: content.tone || null,
        objective: content.objective || null,
        status: content.status || 'active',
        createdAt: now,
        updatedAt: now
      } as Content;
      
      this.contents.set(id, newContent);
      return newContent;
    } catch (error) {
      console.error("Error saving content:", error);
      throw error;
    }
  }

  async deleteContent(id: number): Promise<void> {
    this.contents.delete(id);
  }

  async getContentCount(userId: string): Promise<number> {
    return Array.from(this.contents.values()).filter(
      (content) => content.userId === userId
    ).length;
  }

  async getContentTypeDistribution(userId: string): Promise<{type: string, count: number}[]> {
    const userContents = Array.from(this.contents.values()).filter(
      (content) => content.userId === userId
    );
    
    const distribution = new Map<string, number>();
    
    userContents.forEach(content => {
      const currentCount = distribution.get(content.type) || 0;
      distribution.set(content.type, currentCount + 1);
    });
    
    return Array.from(distribution.entries()).map(([type, count]) => ({
      type,
      count
    }));
  }
  
  // Credits operations
  async getUserCredits(userId: string): Promise<{amount: number} | undefined> {
    const amount = this.credits.get(userId);
    
    if (amount === undefined) {
      return undefined;
    }
    
    return { amount };
  }

  async updateUserCredits(userId: string, amount: number, source: string): Promise<{amount: number}> {
    const currentAmount = this.credits.get(userId) || 0;
    const newAmount = currentAmount + amount;
    
    this.credits.set(userId, newAmount);
    
    return { amount: newAmount };
  }
}

export const storage = new MemStorage();
