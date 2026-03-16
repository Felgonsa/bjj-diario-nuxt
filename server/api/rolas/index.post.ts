import { and, eq } from 'drizzle-orm';
import { db, rolas, treinos } from '~/db';
import { requireUser } from '~/server/utils/auth';
import { CreateRolaSchema } from '~/utils/schemas/rola.schema';

// POST /api/rolas/create - Criar nova rola

defineRouteMeta({
  openAPI: {
    summary: 'Criar nova Rola',
    description: 'Cria um registro de rola (luta/rolling) associado a um treino.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['treinoId', 'nomeParceiro', 'graduacaoParceiro', 'resultado'],
            properties: {
              treinoId: { type: 'integer', description: 'ID do treino ao qual a rola pertence', example: 1 },
              nomeParceiro: { type: 'string', description: 'Nome do parceiro de treino', example: 'João Silva' },
              graduacaoParceiro: { 
                type: 'string', 
                description: 'Graduação (faixa) do parceiro',
                enum: ['branca', 'cinza_com_branca', 'cinza', 'cinza_com_preta', 'amarela_com_branca', 'amarela', 'amarela_com_preta', 'laranja_com_branca', 'laranja', 'laranja_com_preta', 'verde_com_branca', 'verde', 'verde_com_preta', 'azul', 'roxa', 'marrom', 'preta'],
                example: 'azul'
              },
              resultado: { 
                type: 'string', 
                description: 'Resultado da rola',
                enum: ['finalizei', 'fui_finalizado', 'empate'],
                example: 'finalizei'
              },
              formaFinalizacao: { type: 'string', description: 'Forma de finalização utilizada', example: 'mata leão', nullable: true },
              notas: { type: 'string', description: 'Observações sobre a rola', example: 'Ótima guarda, dificuldade para passar', nullable: true },
              duracao: { type: 'integer', description: 'Duração da rola em minutos', example: 5, nullable: true }
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
    
    // Valida automaticamente com Zod e retorna erro 400 se falhar
    const validatedData = await readValidatedBody(event, (body) => CreateRolaSchema.parse(body));
    
    // Verificar se o treino existe E pertence ao usuário autenticado
    const treinoExistente = await db.select()
      .from(treinos)
      .where(and(eq(treinos.id, validatedData.treinoId), eq(treinos.usuarioId, usuarioId)));
    
    if (treinoExistente.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Treino não encontrado ou você não tem permissão para adicionar rolas a este treino'
      });
    }
    
    const novaRola = {
      treinoId: validatedData.treinoId,
      nomeParceiro: validatedData.nomeParceiro,
      graduacaoParceiro: validatedData.graduacaoParceiro,
      resultado: validatedData.resultado,
      formaFinalizacao: validatedData.formaFinalizacao || null,
      notas: validatedData.notas || null,
      duracao: validatedData.duracao || null
    };
    
    const [rolaCriada] = await db.insert(rolas).values(novaRola).returning();
    
    return {
      success: true,
      data: rolaCriada,
      message: 'Rola criada com sucesso'
    };
    
  } catch (error: any) {
    console.error('Erro ao criar rola:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao criar rola'
    });
  }
});
