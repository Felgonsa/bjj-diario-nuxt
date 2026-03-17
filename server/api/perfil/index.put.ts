import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, users } from '~/db';
import { requireUser } from '~/server/utils/auth';

// Schema de validação para atualização de perfil
const UpdatePerfilSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  faixa: z.enum([
    'branca',
    'cinza_com_branca',
    'cinza',
    'cinza_com_preta',
    'amarela_com_branca',
    'amarela',
    'amarela_com_preta',
    'laranja_com_branca',
    'laranja',
    'laranja_com_preta',
    'verde_com_branca',
    'verde',
    'verde_com_preta',
    'azul',
    'roxa',
    'marrom',
    'preta'
  ]).optional(),
  graus: z.number().int().min(0).max(6).optional(),
  equipe: z.string().max(255).nullable().optional(),
  pesoAtual: z.number().positive().nullable().optional(),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').nullable().optional(),
  dataUltimaGraduacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').nullable().optional(),
  altura: z.number().int().min(50).max(300).nullable().optional(), // altura em cm
  pesoMeta: z.number().positive().nullable().optional()
});

// PUT /api/perfil - Atualizar perfil do usuário autenticado

defineRouteMeta({
  openAPI: {
    summary: 'Atualizar Perfil',
    description: 'Atualiza os dados do perfil do usuário autenticado. O usuário só pode atualizar seu próprio perfil.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'João Silva' },
              faixa: { 
                type: 'string', 
                enum: ['branca', 'azul', 'roxa', 'marrom', 'preta'],
                example: 'azul' 
              },
              graus: { type: 'integer', minimum: 0, maximum: 6, example: 2 },
              equipe: { type: 'string', example: 'Gracie Barra', nullable: true },
              pesoAtual: { type: 'number', example: 82.5, nullable: true },
              dataNascimento: { type: 'string', format: 'date', example: '1990-05-15', nullable: true },
              dataUltimaGraduacao: { type: 'string', format: 'date', example: '2024-01-20', nullable: true },
              altura: { type: 'integer', description: 'Altura em centímetros', example: 178, nullable: true },
              pesoMeta: { type: 'number', example: 80.0, nullable: true }
            }
          }
        }
      }
    }
  }
});

export default defineEventHandler(async (event) => {
  try {
    // Obtém o ID do usuário autenticado - garante que só pode atualizar seu próprio perfil
    const usuarioId = await requireUser(event);
    
    // Verificar se o usuário existe
    const usuarioExistente = await db.select()
      .from(users)
      .where(eq(users.id, usuarioId));
    
    if (usuarioExistente.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuário não encontrado'
      });
    }
    
    // Valida automaticamente com Zod e retorna erro 400 se falhar
    const validatedData = await readValidatedBody(event, (body) => UpdatePerfilSchema.parse(body));
    
    // Preparar dados para atualização
    const dadosAtualizacao: Record<string, any> = {};
    
    // Atualizar apenas os campos fornecidos e validados
    if (validatedData.name !== undefined) {
      dadosAtualizacao.name = validatedData.name;
    }
    
    if (validatedData.faixa !== undefined) {
      dadosAtualizacao.faixa = validatedData.faixa;
    }
    
    if (validatedData.graus !== undefined) {
      dadosAtualizacao.graus = validatedData.graus;
    }
    
    if (validatedData.equipe !== undefined) {
      dadosAtualizacao.equipe = validatedData.equipe;
    }
    
    if (validatedData.pesoAtual !== undefined) {
      dadosAtualizacao.pesoAtual = validatedData.pesoAtual;
    }
    
    if (validatedData.dataNascimento !== undefined) {
      dadosAtualizacao.dataNascimento = validatedData.dataNascimento 
        ? new Date(validatedData.dataNascimento) 
        : null;
    }
    
    if (validatedData.dataUltimaGraduacao !== undefined) {
      dadosAtualizacao.dataUltimaGraduacao = validatedData.dataUltimaGraduacao 
        ? new Date(validatedData.dataUltimaGraduacao) 
        : null;
    }
    
    if (validatedData.altura !== undefined) {
      dadosAtualizacao.altura = validatedData.altura;
    }
    
    if (validatedData.pesoMeta !== undefined) {
      dadosAtualizacao.pesoMeta = validatedData.pesoMeta;
    }
    
    // Se não há dados para atualizar, retornar o usuário atual
    if (Object.keys(dadosAtualizacao).length === 0) {
      const usuario = usuarioExistente[0];
      if (!usuario) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Usuário não encontrado'
        });
      }
      return {
        success: true,
        data: {
          id: usuario.id,
          name: usuario.name ?? null,
          email: usuario.email,
          image: usuario.image ?? null,
          faixa: usuario.faixa,
          graus: usuario.graus,
          equipe: usuario.equipe ?? null,
          pesoAtual: usuario.pesoAtual ?? null,
          dataNascimento: usuario.dataNascimento ?? null,
          dataUltimaGraduacao: usuario.dataUltimaGraduacao ?? null,
          altura: usuario.altura ?? null,
          pesoMeta: usuario.pesoMeta ?? null,
          dataCadastro: usuario.dataCadastro
        },
        message: 'Nenhum dado para atualizar'
      };
    }
    
    // Atualizar no banco - usa o ID do requireUser para garantir segurança
    const resultado = await db
      .update(users)
      .set(dadosAtualizacao)
      .where(eq(users.id, usuarioId))
      .returning();
    
    if (!resultado || resultado.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao atualizar perfil - nenhum registro foi atualizado'
      });
    }
    
    const perfilAtualizado = resultado[0];
    if (!perfilAtualizado) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao atualizar perfil - registro não retornado'
      });
    }
    
    return {
      success: true,
      data: {
        id: perfilAtualizado.id,
        name: perfilAtualizado.name ?? null,
        email: perfilAtualizado.email,
        image: perfilAtualizado.image ?? null,
        faixa: perfilAtualizado.faixa,
        graus: perfilAtualizado.graus,
        equipe: perfilAtualizado.equipe ?? null,
        pesoAtual: perfilAtualizado.pesoAtual ?? null,
        dataNascimento: perfilAtualizado.dataNascimento ?? null,
        dataUltimaGraduacao: perfilAtualizado.dataUltimaGraduacao ?? null,
        altura: perfilAtualizado.altura ?? null,
        pesoMeta: perfilAtualizado.pesoMeta ?? null,
        dataCadastro: perfilAtualizado.dataCadastro
      },
      message: 'Perfil atualizado com sucesso'
    };
    
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    // Erro de validação Zod
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos: ' + error.errors.map((e: any) => e.message).join(', ')
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao atualizar perfil'
    });
  }
});
