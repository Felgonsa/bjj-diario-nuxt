import { db, treinos } from '~/db';
import { CreateTreinoSchema } from '~/utils/schemas/treino.schema';

// POST /api/treinos/create - Criar novo treino

defineRouteMeta({
  openAPI: {
    summary: 'Criar novo Treino',
    description: 'Cria um registro de treino no diário do usuário.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['data', 'duracao', 'tipo'], 
            properties: {
              data: { type: 'string', format: 'date', example: '2026-02-24' },
              duracao: { type: 'integer', description: 'Duração em minutos', example: 90 },
              tipo: { 
                type: 'string', 
                enum: ['com_kimono', 'sem_kimono', 'drills', 'open_mat'], // O Scalar cria um dropdown com isso
                example: 'com_kimono' 
              },
              professor: { type: 'string', example: 'Mestre Elton', nullable: true },
              tecnicasAprendidas: { type: 'string', example: 'Passagem de guarda', nullable: true },
              sentimento: { 
                type: 'string',
                enum: ['cansado', 'forte', 'destruido', 'tecnico', 'normal'],
                example: 'normal',
                nullable: true 
              },
              observacoes: { type: 'string', example: 'Fiquei sem gás no final.', nullable: true }
            }
          }
        }
      }
    }
  }
});

export default defineEventHandler(async (event) => {
  try {
    // Valida automaticamente com Zod e retorna erro 400 se falhar
    const validatedData = await readValidatedBody(event, (body) => CreateTreinoSchema.parse(body));
    
    // Por enquanto, sem autenticação - usar um usuário fixo
    // TODO: Implementar autenticação
    const usuarioId = 1;
    
    const novoTreino = {
      usuarioId,
      data: new Date(validatedData.data),
      duracao: validatedData.duracao,
      tipo: validatedData.tipo,
      professor: validatedData.professor || null,
      tecnicasAprendidas: validatedData.tecnicasAprendidas || null,
      sentimento: validatedData.sentimento || null,
      observacoes: validatedData.observacoes || null
    };
    
    const [treinoCriado] = await db.insert(treinos).values(novoTreino).returning();
    
    return {
      success: true,
      data: treinoCriado,
      message: 'Treino criado com sucesso'
    };
    
  } catch (error: any) {
    console.error('Erro ao criar treino:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao criar treino'
    });
  }
});