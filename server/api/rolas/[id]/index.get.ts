import { and, eq } from 'drizzle-orm';
import { db, rolas, treinos } from '~/db';
import { requireUser } from '~/server/utils/auth';

// GET /api/rolas/[id] - Detalhes de uma rola específica

defineRouteMeta({
  openAPI: {
    summary: 'Obter detalhes de uma Rola',
    description: 'Retorna os detalhes de uma rola específica pelo seu ID.',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID da rola a ser consultada',
        schema: {
          type: 'integer',
          example: 1
        }
      }
    ],
    responses: {
      200: {
        description: 'Detalhes da rola retornados com sucesso',
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
});

export default defineEventHandler(async (event) => {
  try {
    const usuarioId = await requireUser(event);
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
    
    // Buscar a rola verificando se pertence a um treino do usuário autenticado
    const rolaComTreino = await db.select()
      .from(rolas)
      .innerJoin(treinos, eq(rolas.treinoId, treinos.id))
      .where(and(eq(rolas.id, rolaId), eq(treinos.usuarioId, usuarioId)));
    
    if (rolaComTreino.length === 0 || !rolaComTreino[0]) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rola não encontrada'
      });
    }
    
    return {
      success: true,
      data: rolaComTreino[0].rolas
    };
    
  } catch (error: any) {
    console.error('Erro ao buscar rola:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar rola'
    });
  }
});
