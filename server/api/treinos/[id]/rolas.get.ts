import { eq } from 'drizzle-orm';
import { db, rolas, treinos } from '~/db';

// GET /api/treinos/[id]/rolas - Listar todas as rolas de um treino específico

defineRouteMeta({
  openAPI: {
    summary: 'Listar Rolas de um Treino',
    description: 'Retorna todas as rolas associadas a um treino específico.',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID do treino para listar as rolas',
        schema: {
          type: 'integer',
          example: 1
        }
      }
    ],
    responses: {
      200: {
        description: 'Lista de rolas do treino retornada com sucesso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: {
                  type: 'object',
                  properties: {
                    treino: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        usuarioId: { type: 'integer', example: 1 },
                        data: { type: 'string', format: 'date-time', example: '2026-02-24T00:00:00.000Z' },
                        duracao: { type: 'integer', example: 90 },
                        tipo: { 
                type: 'string', 
                enum: ['com_kimono', 'sem_kimono', 'drills', 'open_mat'], // O Scalar cria um dropdown com isso
                example: 'com_kimono' 
              },
                        professor: { type: 'string', example: 'Mestre Carlos' },
                        tecnicasAprendidas: { type: 'string', example: 'Passagem de guarda' },
                        sentimento: { type: 'string', enum: ['cansado', 'forte', 'destruido', 'tecnico', 'normal'], example: 'normal' },
                        observacoes: { type: 'string', example: 'Fiquei sem gás no final.' },
                        createdAt: { type: 'string', format: 'date-time', example: '2026-02-24T10:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2026-02-24T10:00:00.000Z' }
                      }
                    },
                    rolas: {
                      type: 'array',
                      items: {
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
                    },
                    count: { type: 'integer', example: 3 }
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
    
    // Verificar se o treino existe
    const treinoExistente = await db.select().from(treinos).where(eq(treinos.id, treinoId));
    
    if (treinoExistente.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Treino não encontrado'
      });
    }
    
    // Buscar todas as rolas deste treino
    const rolasDoTreino = await db.select().from(rolas).where(eq(rolas.treinoId, treinoId));
    
    return {
      success: true,
      data: {
        treino: treinoExistente[0],
        rolas: rolasDoTreino,
        count: rolasDoTreino.length
      }
    };
    
  } catch (error: any) {
    console.error('Erro ao buscar rolas do treino:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar rolas do treino'
    });
  }
});