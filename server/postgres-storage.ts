import { db } from './db';
import { eq, sql, and } from 'drizzle-orm';
import { 
  users, userProfiles, contents, credits,
  type User, type InsertUser, 
  type UserProfile, type InsertUserProfile, 
  type Content, type InsertContent
} from '../shared/schema';
import { IStorage } from './storage';

export class PostgresStorage implements IStorage {
  
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUser(insertUser.id);
    if (existingUser) {
      return existingUser;
    }
    
    const result = await db.insert(users).values({
      ...insertUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return result[0];
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async saveUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values({
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return result[0];
  }

  async updateUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const existingProfile = await this.getUserProfile(profile.userId);
    
    if (!existingProfile) {
      return this.saveUserProfile(profile);
    }
    
    const result = await db.update(userProfiles)
      .set({
        businessType: profile.businessType || existingProfile.businessType,
        targetPersona: profile.targetPersona || existingProfile.targetPersona,
        channels: profile.channels || existingProfile.channels,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, profile.userId))
      .returning();
    
    return result[0];
  }

  async getContent(id: number): Promise<Content | undefined> {
    const result = await db.select().from(contents).where(eq(contents.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserContents(userId: string, type?: string): Promise<Content[]> {
    if (type) {
      return db.select().from(contents)
        .where(and(
          eq(contents.userId, userId),
          eq(contents.type, type)
        ))
        .orderBy(sql`${contents.createdAt} DESC`);
    }
    
    return db.select().from(contents)
      .where(eq(contents.userId, userId))
      .orderBy(sql`${contents.createdAt} DESC`);
  }

  async saveContent(content: InsertContent): Promise<Content> {
    const result = await db.insert(contents).values({
      ...content,
      title: content.title || null,
      tone: content.tone || null,
      objective: content.objective || null,
      status: content.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return result[0];
  }

  async deleteContent(id: number): Promise<void> {
    await db.delete(contents).where(eq(contents.id, id));
  }

  async getContentCount(userId: string): Promise<number> {
    const result = await db.select({
      count: sql<number>`count(*)`
    }).from(contents).where(eq(contents.userId, userId));
    
    return result[0].count;
  }

  async getContentTypeDistribution(userId: string): Promise<{type: string, count: number}[]> {
    const result = await db.select({
      type: contents.type,
      count: sql<number>`count(*)`
    })
    .from(contents)
    .where(eq(contents.userId, userId))
    .groupBy(contents.type);
    
    return result;
  }

  async getUserCredits(userId: string): Promise<{amount: number} | undefined> {
    const result = await db.select({
      amount: sql<number>`sum(amount)`
    })
    .from(credits)
    .where(eq(credits.userId, userId));
    
    if (result.length === 0 || result[0].amount === null) {
      return undefined;
    }
    
    return { amount: result[0].amount };
  }

  async updateUserCredits(userId: string, amount: number, source: string): Promise<{amount: number}> {
    await db.insert(credits).values({
      userId,
      amount,
      source,
      createdAt: new Date(),
    });
    
    // Get updated total
    const userCredits = await this.getUserCredits(userId);
    return { amount: userCredits?.amount || amount };
  }
}