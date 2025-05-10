import prisma from './prisma-client';
import type { IStorage } from './storage';
// Importar tipos diretamente do @prisma/client
import { User, UserProfile, Content, Credit, ContentType, Prisma } from '@prisma/client';

// Remover importações de '../../shared/schema' se os tipos do Prisma forem suficientes
// import type {
//   User as SharedUser, InsertUser as SharedInsertUser,
//   UserProfile as SharedUserProfile, InsertUserProfile as SharedInsertUserProfile,
//   Content as SharedContent, InsertContent as SharedInsertContent,
//   Credit as SharedCredit, InsertCredit as SharedInsertCredit,
//   ContentType as SharedContentType
// } from '../../shared/schema';

export class PrismaStorage implements IStorage {
  async getUser(id: string): Promise<User | null> { // Retorno pode ser null
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> { // Retorno pode ser null
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> { // Retorno pode ser null
    return prisma.userProfile.findUnique({ where: { userId } });
  }

  async saveUserProfile(data: Prisma.UserProfileUncheckedCreateInput): Promise<UserProfile> {
    // UserProfileUncheckedCreateInput permite passar userId diretamente,
    // e o Prisma gerencia o ID do UserProfile (UUID)
    // Garanta que 'email' esteja incluído em 'data' conforme o schema UserProfile
    return prisma.userProfile.create({ data });
  }

  async updateUserProfile(userId: string, data: Prisma.UserProfileUncheckedUpdateInput): Promise<UserProfile> {
    // UserProfileUncheckedUpdateInput para atualizações
    return prisma.userProfile.update({
      where: { userId },
      data,
    });
  }

  async getContent(id: string): Promise<Content | null> { // id já é string, retorno pode ser null
    return prisma.content.findUnique({ where: { id } });
  }

  async getUserContents(userId: string, type?: ContentType): Promise<Content[]> {
    return prisma.content.findMany({
      where: {
        userId,
        ...(type && { type }), // 'type' aqui já deve ser do enum ContentType
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async saveContent(data: Prisma.ContentUncheckedCreateInput): Promise<Content> {
    // ContentUncheckedCreateInput para passar userId e type (enum)
    return prisma.content.create({ data });
  }

  async deleteContent(id: string): Promise<void> { // id já é string
    await prisma.content.delete({ where: { id } });
    // Prisma delete não retorna nada por padrão, então Promise<void> está correto.
    // Para confirmar a exclusão, pode-se tentar buscar o item antes ou verificar o count.
  }

  async getContentCount(userId: string): Promise<number> {
    return prisma.content.count({ where: { userId } });
  }

  async getContentTypeDistribution(userId: string): Promise<{ type: ContentType; count: number }[]> {
    const result = await prisma.content.groupBy({
      by: ['type'],
      where: { userId },
      _count: {
        type: true,
      },
    });
    return result.map(item => ({ type: item.type, count: item._count.type }));
  }

  async getUserCredits(userId: string): Promise<{ amount: number } | null> { // Retorno pode ser null
    const aggregation = await prisma.credit.aggregate({
      _sum: {
        amount: true,
      },
      where: { userId },
    });
    const totalAmount = aggregation._sum.amount;
    return totalAmount !== null ? { amount: totalAmount } : null;
  }

  async updateUserCredits(userId: string, amountChange: number, source: string): Promise<{ amount: number }> {
    // Criar um novo registro de crédito para a transação
    await prisma.credit.create({
      data: {
        userId,
        amount: amountChange,
        source,
        // user: { connect: { id: userId } } // Prisma infere a conexão pelo userId
      },
    });
    // Retornar o novo total agregado
    const newTotal = await this.getUserCredits(userId);
    // Se newTotal for null (nenhum crédito ainda), o amount deve ser o amountChange que acabou de ser adicionado
    // ou 0 se o amountChange for negativo e não houver créditos anteriores.
    // A lógica aqui é que getUserCredits retorna o *total*. Se ele retorna null, o total é 0.
    // O amountChange é o que foi *transacionado*. O resultado deve ser o novo *total*.
    if (newTotal) {
        return { amount: newTotal.amount };
    }
    // Se não havia créditos e adicionamos/subtraímos, o novo total é o amountChange (se positivo)
    // ou 0 (se negativo e não havia nada, não podemos ter créditos negativos no total).
    // Simplificando: se getUserCredits é null, significa que o total era 0 antes desta transação.
    // O novo total é o amountChange, mas não pode ser negativo.
    // No entanto, getUserCredits após a criação já deve refletir o novo total.
    // Uma forma mais segura é recalcular o total.
    const finalTotalAggregation = await prisma.credit.aggregate({
        _sum: { amount: true },
        where: { userId },
    });
    return { amount: finalTotalAggregation._sum.amount ?? 0 };
  }
} 