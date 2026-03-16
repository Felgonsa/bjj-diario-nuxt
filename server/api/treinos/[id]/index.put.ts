import { and, eq } from 'drizzle-orm';
import { db, treinos } from '~/db';
import { requireUser } from '~/server/utils/auth';
import { UpdateTreinoSchema } from '~/utils/schemas/treino.schema';

// PUT /api/treinos/[id] - Atualizar treino

defineRouteMeta({
  openAPI: {
    summary: 'Atualizar Treino',
    description: 'Atualiza um registro de treino existente no diário do usuário.',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID do treino a ser atualizado',
        schema: {
          type: 'integer',
          example: 1
        }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: { type: 'string', format: 'date', example: '2026-02-24' },
              duracao: { type: 'integer', description: 'Duração em minutos', example: 90 },
              tipo: { 
                type: 'string', 
                enum: ['com_kimono', 'sem_kimono', 'drills', 'open_mat'],
                example: 'com_kimono' 
              },
              professor: { type: 'string', example: 'Mestre Carlos', nullable: true },
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
    const usuarioId = await requireUser(event);
    const id = getRouterParam(event, 'id');
    
    // Validar ID do treino
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'ID do treino inválido. Deve ser um número positivo.' 
      });
    }
    
    const treinoId = Number(id);
    
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
    
    // Valida automaticamente com Zod e retorna erro 400 se falhar
    const validatedData = await readValidatedBody(event, (body) => UpdateTreinoSchema.parse(body));
    
    // Preparar dados para atualização
    const dadosAtualizacao: any = {};
    
    // Atualizar apenas os campos fornecidos e validados
    if (validatedData.data !== undefined) {
      dadosAtualizacao.data = new Date(validatedData.data);
    }
    
    if (validatedData.duracao !== undefined) {
      dadosAtualizacao.duracao = validatedData.duracao;
    }
    
    if (validatedData.tipo !== undefined) {
      dadosAtualizacao.tipo = validatedData.tipo;
    }
    
    if (validatedData.professor !== undefined) {
      dadosAtualizacao.professor = validatedData.professor || null;
    }
    
    if (validatedData.tecnicasAprendidas !== undefined) {
      dadosAtualizacao.tecnicasAprendidas = validatedData.tecnicasAprendidas || null;
    }
    
    if (validatedData.sentimento !== undefined) {
      dadosAtualizacao.sentimento = validatedData.sentimento || null;
    }
    
    if (validatedData.observacoes !== undefined) {
      dadosAtualizacao.observacoes = validatedData.observacoes || null;
    }
    
    // Se não há dados para atualizar, retornar o treino atual
    if (Object.keys(dadosAtualizacao).length === 0) {
      return {
        success: true,
        data: treinoExistente[0],
        message: 'Nenhum dado para atualizar'
      };
    }
    
    // Atualizar data de atualização
    dadosAtualizacao.updatedAt = new Date();
    
    // Atualizar no banco (já verificamos que pertence ao usuário)
    const [treinoAtualizado] = await db
      .update(treinos)
      .set(dadosAtualizacao)
      .where(eq(treinos.id, treinoId))
      .returning();
    
    return {
      success: true,
      data: treinoAtualizado,
      message: 'Treino atualizado com sucesso'
    };
    
  } catch (error: any) {
    console.error('Erro ao atualizar treino:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao atualizar treino'
    });
  }
});
