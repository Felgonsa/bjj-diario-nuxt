import { and, eq } from 'drizzle-orm';
import { db, rolas, treinos } from '~/db';
import { requireUser } from '~/server/utils/auth';

// DELETE /api/treinos/[id] - Excluir treino (e suas rolas relacionadas)

defineRouteMeta({
  openAPI: {
    summary: 'Excluir Treino',
    description: 'Exclui um registro de treino e todas as rolas relacionadas a ele.',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID do treino a ser excluído',
        schema: {
          type: 'integer',
          example: 1
        }
      }
    ],
    responses: {
      200: {
        description: 'Treino e rolas relacionadas excluídos com sucesso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Treino e rolas relacionadas excluídos com sucesso' },
                data: {
                  type: 'object',
                  properties: {
                    treinoId: { type: 'integer', example: 1 },
                    treinoExcluido: {
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
    
    // Verificar se o treino existe E pertence ao usuário autenticado
    const treinoExistente = await db.select()
      .from(treinos)
      .where(and(eq(treinos.id, treinoId), eq(treinos.usuarioId, usuarioId)));
    
    if (treinoExistente.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Treino não encontrado'
      });
    }
    
    // Primeiro, excluir todas as rolas relacionadas a este treino
    // (devido à constraint de chave estrangeira com cascade, isso acontece automaticamente,
    // mas vamos fazer explicitamente para registro)
    await db.delete(rolas).where(eq(rolas.treinoId, treinoId));
    
    // Agora excluir o treino
    await db.delete(treinos).where(eq(treinos.id, treinoId));
    
    return {
      success: true,
      message: 'Treino e rolas relacionadas excluídos com sucesso',
      data: {
        treinoId,
        treinoExcluido: treinoExistente[0]
      }
    };
    
  } catch (error: any) {
    console.error('Erro ao excluir treino:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao excluir treino'
    });
  }
});
