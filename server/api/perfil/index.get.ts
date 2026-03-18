import { eq } from 'drizzle-orm';
import { db, users } from '~/db';
import { requireUser } from '~/server/utils/auth';

// GET /api/perfil - Obter perfil do usuário autenticado

defineRouteMeta({
  openAPI: {
    summary: 'Obter Perfil',
    description: 'Obtém os dados do perfil do usuário autenticado.',
    responses: {
      200: {
        description: 'Perfil do usuário',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                    name: { type: 'string', example: 'João Silva', nullable: true },
                    email: { type: 'string', example: 'joao@example.com' },
                    image: { type: 'string', example: 'https://example.com/avatar.jpg', nullable: true },
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
                    pesoMeta: { type: 'number', example: 80.0, nullable: true },
                    dataCadastro: { type: 'string', format: 'date-time', example: '2024-01-01T10:00:00Z' }
                  }
                },
                message: { type: 'string', example: 'Perfil obtido com sucesso' }
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
    // Obtém o ID do usuário autenticado
    const usuarioId = await requireUser(event);
    
    // Buscar dados do usuário
    const resultado = await db.select()
      .from(users)
      .where(eq(users.id, usuarioId));
    
    if (resultado.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuário não encontrado'
      });
    }
    
    const usuario = resultado[0]!;
    
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
      message: 'Perfil obtido com sucesso'
    };
    
  } catch (error: any) {
    console.error('Erro ao obter perfil:', error);
    
    // Se já for um erro criado com createError, rethrow
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao obter perfil'
    });
  }
});
