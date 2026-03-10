import { eq } from 'drizzle-orm';
import { db, rolas } from '~/db';

// DELETE /api/rolas/[id] - Excluir rola

defineRouteMeta({
  openAPI: {
    summary: 'Excluir Rola',
    description: 'Exclui um registro de rola existente.',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID da rola a ser excluída',
        schema: {
          type: 'integer',
          example: 1
        }
      }
    ],
    responses: {
      200: {
        description: 'Rola excluída com sucesso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Rola excluída com sucesso' },
                data: {
                  type: 'object',
                  properties: {
                    rolaId: { type: 'integer', example: 1 },
                    rolaExcluida: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        treinoId: { type: 'integer', example: 1 },
                        nomeParceiro: { type: 'string', example: 'João Silva' },
                        graduacaoParceiro: { type: 'string', example: 'azul' },
                        resultado: { type: 'string', example: 'finalizei' },
                        formaFinalizacao: { type: 'string', example: 'mata leão' },
                        notas: { type: 'string', example: 'Ótima guarda' },
                        duracao: { type: 'integer', example: 5 },
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
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID da rola é obrigatório'
      });
    }
    
    const rolaId = parseInt(id);
    
    if (isNaN(rolaId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID da rola deve ser um número válido'
      });
    }
    
    // Verificar se a rola existe
    const rolaExistente = await db.select().from(rolas).where(eq(rolas.id, rolaId));
    
    if (rolaExistente.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rola não encontrada'
      });
    }
    
    // Excluir a rola
    await db.delete(rolas).where(eq(rolas.id, rolaId));
    
    return {
      success: true,
      message: 'Rola excluída com sucesso',
      data: {
        rolaId,
        rolaExcluida: rolaExistente[0]
      }
    };
    
  } catch (error: any) {
    console.error('Erro ao excluir rola:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao excluir rola'
    });
  }
});