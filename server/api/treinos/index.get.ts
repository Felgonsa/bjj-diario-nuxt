import { desc, eq } from 'drizzle-orm';
import { db, treinos } from '~/db';
import { requireUser } from '~/server/utils/auth';

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

    const usuarioId = await requireUser(event)

    const treinosDoUsuario = await db.select()
      .from(treinos)
      .where(eq(treinos.usuarioId, usuarioId))
      .orderBy(desc(treinos.data));

    return {
      success: true,
      count: treinosDoUsuario.length,
      data: treinosDoUsuario
    };

  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    // ... repassa o erro para frente (se for o erro 401 do requireUser, ele vai certinho)
    throw error; 
  }
});