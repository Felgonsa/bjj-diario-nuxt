import { db, rolas, treinos } from '~/db';
import { CreateTreinoSchema } from '~/utils/schemas/treino.schema';

// POST /api/treinos/create - Criar novo treino
defineRouteMeta({
  openAPI: {
    summary: 'Criar novo Treino',
    description: 'Cria um registro de treino no diário do usuário, incluindo a lista de rolas (lutas).',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['data', 'duracao', 'tipo'], 
            properties: {
              data: { type: 'string', format: 'date', example: '2026-03-11' },
              duracao: { type: 'integer', description: 'Duração em minutos', example: 90 },
              tipo: { 
                type: 'string', 
                enum: ['com_kimono', 'sem_kimono', 'drills', 'open_mat'], 
                example: 'com_kimono' 
              },
              professor: { type: 'string', example: 'Mestre Elton', nullable: true },
              tecnicasAprendidas: { type: 'string', example: 'Passagem de guarda', nullable: true },
              sentimento: { 
                type: 'string',
                enum: ['cansado', 'forte', 'destruido', 'tecnico', 'normal'],
                example: 'normal',
                nullable: true 
              },
              observacoes: { type: 'string', example: 'Fiquei sem gás no final.', nullable: true },
              // --- ADICIONADO AQUI A DOCUMENTAÇÃO DOS ROLAS ---
              rolas: {
                type: 'array',
                description: 'Lista de rolas (lutas) ocorridos neste treino',
                items: {
                  type: 'object',
                  required: ['nomeParceiro', 'graduacaoParceiro', 'resultado'],
                  properties: {
                    nomeParceiro: { type: 'string', example: 'Gabriel' },
                    graduacaoParceiro: { type: 'string', example: 'verde' },
                    duracao: { type: 'integer', example: 5, nullable: true },
                    resultado: { 
                      type: 'string', 
                      enum: ['finalizei', 'fui_finalizado', 'empate'],
                      example: 'fui_finalizado'
                    },
                    formaFinalizacao: { type: 'string', example: 'Americana (100kg)', nullable: true },
                    notas: { type: 'string', example: null, nullable: true }
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
    // Valida automaticamente com Zod e retorna erro 400 se falhar
    const validatedData = await readValidatedBody(event, (body) => CreateTreinoSchema.parse(body));
    
    // Por enquanto, sem autenticação - usar um usuário fixo
    // TODO: Implementar autenticação
    const usuarioId = 1;
    
    const novoTreino = {
      usuarioId,
      data: new Date(validatedData.data),
      duracao: validatedData.duracao,
      tipo: validatedData.tipo,
      professor: validatedData.professor || null,
      tecnicasAprendidas: validatedData.tecnicasAprendidas || null,
      sentimento: validatedData.sentimento || null,
      observacoes: validatedData.observacoes || null
    };
    
    const [treinoCriado] = await db.insert(treinos).values(novoTreino).returning();

    if (!treinoCriado) {
      throw createError({ statusCode: 500, statusMessage: 'Falha ao gerar o ID do treino' });
    }

    if (validatedData.rolas && validatedData.rolas.length > 0) {
      // Prepara a lista carimbando o ID do treino recém-criado em cada rola
      const rolasParaInserir = validatedData.rolas.map((rola: any) => ({
        ...rola,
        treinoId: treinoCriado.id, 
        usuarioId: usuarioId 
      }));

      // Faz um insert em massa (bulk insert) de todas as lutas de uma vez
      await db.insert(rolas).values(rolasParaInserir);
    }
    
    return {
      success: true,
      data: treinoCriado,
      message: 'Treino criado com sucesso'
    };
    
  } catch (error: any) {
    console.error('Erro ao criar treino:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao criar treino'
    });
  }
});