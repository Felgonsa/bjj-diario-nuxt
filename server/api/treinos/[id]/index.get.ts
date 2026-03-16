import { and, eq } from 'drizzle-orm';
import { db, treinos } from '~/db';
import { requireUser } from '~/server/utils/auth';

// GET /api/treinos/[id] - Detalhes de um treino específico

defineRouteMeta({
  openAPI: {
    summary: 'Obter detalhes de um Treino',
    description: 'Retorna os detalhes de um treino específico pelo seu ID.',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID do treino a ser consultado',
        schema: {
          type: 'integer',
          example: 1
        }
      }
    ],
    responses: {
      200: {
        description: 'Detalhes do treino retornados com sucesso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    usuarioId: { type: 'integer', example: 1 },
                    data: { type: 'string', format: 'date-time', example: '2026-02-24T00:00:00.000Z' },
                    duracao: { type: 'integer', example: 90 },
                    tipo: { 
                type: 'string', 
                enum: ['com_kimono', 'sem_kimono', 'drills', 'open_mat'],
                example: 'com_kimono' 
              },
                    professor: { type: 'string', example: 'Mestre Carlos' },
                    tecnicasAprendidas: { type: 'string', example: 'Passagem de guarda' },
                    sentimento: { type: 'string', enum: ['cansado', 'forte', 'destruido', 'tecnico', 'normal'], example: 'normal' },
                    observacoes: { type: 'string', example: 'Fiquei sem gás no final.' },
                    createdAt: { type: 'string', format: 'date-time', example: '2026-02-24T10:00:00.000Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2026-02-24T10:00:00.000Z' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

export default defineEventHandler(async (event) => {
  try {
    const usuarioId = await requireUser(event);
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do treino é obrigatório'
      });
    }
    
    const treinoId = parseInt(id);
    
    if (isNaN(treinoId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do treino deve ser um número válido'
      });
    }
    
    // Busca o treino verificando se pertence ao usuário autenticado
    const treino = await db.select()
      .from(treinos)
      .where(and(eq(treinos.id, treinoId), eq(treinos.usuarioId, usuarioId)));
    
    if (treino.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Treino não encontrado'
      });
    }
    
    return {
      success: true,
      data: treino[0]
    };
    
  } catch (error: any) {
    console.error('Erro ao buscar treino:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar treino'
    });
  }
});
