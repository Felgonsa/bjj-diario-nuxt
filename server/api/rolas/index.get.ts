import { db, rolas } from '~/db';

// GET /api/rolas - Listar todas as rolas

defineRouteMeta({
  openAPI: {
    summary: 'Listar todas as Rolas',
    description: 'Retorna uma lista de todas as rolas registradas no diário.',
    responses: {
      200: {
        description: 'Lista de rolas retornada com sucesso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: {
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
                count: { type: 'integer', example: 10 }
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
    const allRolas = await db.select().from(rolas);
    
    return {
      success: true,
      data: allRolas,
      count: allRolas.length
    };
  } catch (error) {
    console.error('Erro ao buscar rolas:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar rolas'
    });
  }
});