import prisma from './prisma-client';
import type { IStorage } from './storage'; // Assumindo que IStorage estará em api/_lib/storage.ts
import type {
  User, InsertUser,
  UserProfile, InsertUserProfile,
  Content, InsertContent,
  Credit, InsertCredit, // Embora Credit não seja usado diretamente aqui, é bom para referência futura
  ContentType
} from '../../shared/schema'; // Ajustado o caminho

export class PrismaStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user || undefined;
  }

  async createUser(data: InsertUser): Promise<User> {
    // No Prisma, se User tem um profile opcional, pode ser criado separadamente ou com transação.
    // O schema atual tem User.id como string, e não auto-incremento, então deve ser fornecido.
    // A InsertUser de @shared/schema deve ser compatível.
    return prisma.user.create({ data });
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    return profile || undefined;
  }

  async saveUserProfile(data: InsertUserProfile): Promise<UserProfile> {
    // O ID do UserProfile é um UUID gerado pelo banco/Prisma.
    // InsertUserProfile deve ter userId, e os outros campos.
    return prisma.userProfile.create({ data });
  }

  async updateUserProfile(data: InsertUserProfile): Promise<UserProfile> {
    // InsertUserProfile aqui deve conter o userId para encontrar o perfil a ser atualizado.
    // E os campos a serem atualizados.
    // O schema do UserProfile tem updatedAt, então o Prisma cuida disso.
    return prisma.userProfile.update({
      where: { userId: data.userId }, // Supondo que data.userId está presente
      data: {
        name: data.name,
        businessType: data.businessType,
        targetPersona: data.targetPersona,
        channels: data.channels,
      },
    });
  }

  // NOTA: A interface IStorage usa id: number para Content.
  // O schema.prisma usa id: String @id @default(uuid()) para Content.
  // Vou assumir que precisamos usar string para consistência com o schema.
  // Se IStorage for mantida com id: number, uma conversão ou refatoração da interface será necessária.

  async getContent(id: string): Promise<Content | undefined> { // Alterado para id: string
    const content = await prisma.content.findUnique({ where: { id } });
    return content || undefined;
  }

  async getUserContents(userId: string, type?: string): Promise<Content[]> {
    return prisma.content.findMany({
      where: {
        userId,
        ...(type && { type: type as ContentType }), // Garante que o tipo seja o enum ContentType
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async saveContent(data: InsertContent): Promise<Content> {
    // InsertContent deve ser compatível com o model Content do Prisma.
    // O ID é gerado automaticamente.
    return prisma.content.create({ data });
  }

  async deleteContent(id: string): Promise<void> { // Alterado para id: string
    await prisma.content.delete({ where: { id } });
  }

  async getContentCount(userId: string): Promise<number> {
    return prisma.content.count({ where: { userId } });
  }

  async getContentTypeDistribution(userId: string): Promise<{ type: string; count: number }[]> {
    const result = await prisma.content.groupBy({
      by: ['type'],
      where: { userId },
      _count: {
        type: true,
      },
    });
    return result.map(item => ({ type: item.type, count: item._count.type }));
  }

  async getUserCredits(userId: string): Promise<{ amount: number } | undefined> {
    // O schema Credit tem amount: Int. Se houver múltiplos registros de crédito por usuário,
    // precisaríamos somá-los. O schema atual sugere que pode haver múltiplos.
    // Vamos assumir que a lógica correta é somar todos os créditos do usuário.
    const allCredits = await prisma.credit.findMany({ where: { userId } });
    if (!allCredits || allCredits.length === 0) return undefined;
    const totalAmount = allCredits.reduce((sum, credit) => sum + credit.amount, 0);
    return { amount: totalAmount };
  }

  async updateUserCredits(userId: string, amountChange: number, source: string): Promise<{ amount: number }> {
    // Esta função na IStorage sugere adicionar ou subtrair do total.
    // No Prisma, isso significa criar um novo registro de transação de crédito.
    await prisma.credit.create({
      data: {
        userId,
        amount: amountChange,
        source,
      },
    });
    // Retornar o novo total
    const currentTotal = await this.getUserCredits(userId);
    return { amount: currentTotal?.amount ?? 0 }; // Se não houver créditos, o novo total é 0 + amountChange indiretamente
  }
} 