import prisma from './prisma-client.js';
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
    const { userId, email, ...updateDataFields } = data;

    if (!userId) {
      throw new Error("userId é obrigatório para salvar o perfil do usuário.");
    }
    if (!email) {
        throw new Error("email é obrigatório para salvar o perfil do usuário.");
    }
    
    const createInput: Prisma.UserProfileUncheckedCreateInput = {
        userId: data.userId,
        email: data.email,
        name: data.name,
        businessType: data.businessType,
        targetPersona: data.targetPersona,
        channels: data.channels,
    };

    const updateInput: Prisma.UserProfileUncheckedUpdateInput = {
        email: data.email, 
        name: data.name,
        businessType: data.businessType,
        targetPersona: data.targetPersona,
        channels: data.channels,
    };

    return prisma.userProfile.upsert({
      where: {
        userId: data.userId, 
      },
      create: createInput,  
      update: updateInput,  
    });
  }

  async updateUserProfile(userId: string, data: Prisma.UserProfileUncheckedUpdateInput): Promise<UserProfile | null> {
    try {
        return prisma.userProfile.update({
            where: { userId },
            data,
        });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            console.warn(`Perfil não encontrado para atualização com userId: ${userId}`);
            return null; 
        }
        throw error; 
    }
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

  async findOrCreateUser(data: { id: string; email: string; }): Promise<User> {
    let user = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      // Se o usuário não for encontrado pelo ID, tenta encontrar pelo e-mail.
      // Isso pode ser útil se, por algum motivo, o ID do Supabase Auth mudasse
      // ou se houvesse uma tentativa de criar um usuário com e-mail já existente mas ID diferente.
      // No entanto, para o ID do Supabase Auth, ele deve ser estável.
      // A lógica principal é criar se não existe pelo ID.
      user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        // Usuário não encontrado nem por ID nem por e-mail, então criar.
        user = await prisma.user.create({
          data: {
            id: data.id, // Este é o Supabase Auth User ID
            email: data.email,
            // Você pode querer adicionar um nome default se sua tabela 'users' tiver um campo 'name'
            // Ex: name: data.email.split('@')[0],
          },
        });
      } else {
        // Usuário encontrado pelo e-mail, mas não pelo ID. 
        // Isso pode indicar um problema de sincronização ou um caso atípico.
        // Por ora, vamos retornar o usuário encontrado pelo e-mail.
        // Você pode querer logar isso ou ter uma estratégia diferente.
        console.warn(`User found by email (${data.email}) but not by ID (${data.id}). Returning user found by email.`);
      }
    }
    return user;
  }
} 