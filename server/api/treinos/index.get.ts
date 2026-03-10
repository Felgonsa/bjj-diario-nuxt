import { db } from '~/db';

// GET /api/treinos - Listar todos os treinos

defineRouteMeta({
  openAPI: {
    summary: 'Listar todos os Treinos',
    description: 'Retorna uma lista de todos os treinos registrados no diário.',
    responses: {
      200: {
        description: 'Lista de treinos retornada com sucesso',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
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
    // Por enquanto, sem autenticação - retorna todos os treinos
    const allTreinos = await db.query.treinos.findMany({
  with: {
    rolas: true //O Drizzle faz o JOIN sozinho.
  }
});
    
    return {
      success: true,
      data: allTreinos,
      count: allTreinos.length
    };
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar treinos'
    });
  }
});