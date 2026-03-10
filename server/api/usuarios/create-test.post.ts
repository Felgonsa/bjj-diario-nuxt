import { db, usuarios } from '~/db';

// POST /api/usuarios/create-test - Criar usuário de teste

defineRouteMeta({
  openAPI: {
    summary: 'Criar Usuário de Teste',
    description: 'Cria um usuário de teste para desenvolvimento. Se já existir um usuário, retorna o existente.',
    responses: {
      200: {
        description: 'Usuário de teste criado ou já existente',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Usuário de teste criado com sucesso' },
                data: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    nome: { type: 'string', example: 'Usuário Teste' },
                    email: { type: 'string', example: 'teste@email.com' },
                    senha: { type: 'string', example: 'senha123' },
                    faixa: { type: 'string', example: 'azul' },
                    graus: { type: 'integer', example: 2 },
                    equipe: { type: 'string', example: 'Equipe Teste' },
                    pesoAtual: { type: 'number', example: 75.5 },
                    createdAt: { type: 'string', format: 'date-time', example: '2026-02-24T10:00:00.000Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2026-02-24T10:00:00.000Z' }
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
    // Verificar se já existe algum usuário
    const existingUsers = await db.select().from(usuarios);
    
    if (existingUsers.length > 0) {
      return {
        success: true,
        message: 'Usuário já existe',
        data: existingUsers[0]
      };
    }
    
    // Criar usuário de teste
    const [newUser] = await db.insert(usuarios).values({
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: 'senha123', // Em produção, usar hash!
      faixa: 'azul',
      graus: 2,
      equipe: 'Equipe Teste',
      pesoAtual: 75.5
    }).returning();
    
    return {
      success: true,
      message: 'Usuário de teste criado com sucesso',
      data: newUser
    };
    
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao criar usuário de teste'
    });
  }
});