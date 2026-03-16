import { eq } from 'drizzle-orm';
import { db, rolas, treinos } from '~/db';
import { requireUser } from '~/server/utils/auth';

// GET /api/rolas - Listar todas as rolas do usuário autenticado

defineRouteMeta({
  openAPI: {
    summary: 'Listar todas as Rolas do usuário',
    description: 'Retorna uma lista de todas as rolas registradas pelo usuário autenticado.',
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
    const usuarioId = await requireUser(event);
    
    // Buscar todas as rolas dos treinos do usuário autenticado
    // Usando uma subquery para buscar rolas apenas dos treinos do usuário
    const rolasDoUsuario = await db.select()
      .from(rolas)
      .innerJoin(treinos, eq(rolas.treinoId, treinos.id))
      .where(eq(treinos.usuarioId, usuarioId));
    
    // Extrair apenas os dados das rolas
    const rolasData = rolasDoUsuario.map(row => row.rolas);
    
    return {
      success: true,
      data: rolasData,
      count: rolasData.length
    };
  } catch (error) {
    console.error('Erro ao buscar rolas:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar rolas'
    });
  }
});
