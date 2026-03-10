import { eq } from 'drizzle-orm';
import { db, rolas, treinos } from '~/db';
import { UpdateRolaSchema } from '~/utils/schemas/rola.schema';

// PUT /api/rolas/[id] - Atualizar rola

defineRouteMeta({
  openAPI: {
    summary: 'Atualizar Rola',
    description: 'Atualiza um registro de rola existente.',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID da rola a ser atualizada',
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
    // 1. Validar ID da rota
    const id = getRouterParam(event, 'id');
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'ID da rola inválido. Deve ser um número positivo.' 
      });
    }

    const rolaId = Number(id);

    // 2. Verificar se a rola existe
    const rolaExistente = await db.select().from(rolas).where(eq(rolas.id, rolaId));
    if (!rolaExistente.length) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Rola não encontrada' 
      });
    }

    // 3. Validar corpo da requisição com Zod usando readValidatedBody
    const validatedData = await readValidatedBody(event, (body) => UpdateRolaSchema.parse(body));

    // 4. Verificar se o treino existe (se treinoId foi fornecido)
    if (validatedData.treinoId !== undefined) {
      const treinoExistente = await db.select().from(treinos).where(eq(treinos.id, validatedData.treinoId));
      if (!treinoExistente.length) {
        throw createError({ 
          statusCode: 404, 
          statusMessage: 'Treino não encontrado' 
        });
      }
    }

    // 5. Preparar dados para atualização
    // Filtrar apenas os campos que foram fornecidos e não são undefined
    const dadosAtualizacao = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    );

    // Tratar campos que podem ser null
    if (validatedData.formaFinalizacao !== undefined) {
      dadosAtualizacao.formaFinalizacao = validatedData.formaFinalizacao || null;
    }
    if (validatedData.notas !== undefined) {
      dadosAtualizacao.notas = validatedData.notas || null;
    }
    if (validatedData.duracao !== undefined) {
      dadosAtualizacao.duracao = validatedData.duracao || null;
    }

    // 6. Se não há dados para atualizar, retornar a rola atual
    if (Object.keys(dadosAtualizacao).length === 0) {
      return {
        success: true,
        data: rolaExistente[0],
        message: 'Nenhum dado para atualizar'
      };
    }

    // 7. Atualizar no banco
    const [rolaAtualizada] = await db
      .update(rolas)
      .set(dadosAtualizacao)
      .where(eq(rolas.id, rolaId))
      .returning();

    return {
      success: true,
      data: rolaAtualizada,
      message: 'Rola atualizada com sucesso'
    };

  } catch (error: any) {
    console.error('Erro ao atualizar rola:', error);

    // Se já for um erro HTTP, rethrow
    if (error.statusCode) {
      throw error;
    }

    // Erro interno do servidor
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao atualizar rola'
    });
  }
});