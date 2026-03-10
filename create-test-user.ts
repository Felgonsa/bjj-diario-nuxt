import { db, usuarios } from './db';

async function createTestUser() {
  try {
    console.log('Criando usuário de teste...');
    
    // Verificar se já existe algum usuário
    const existingUsers = await db.select().from(usuarios);
    
    if (existingUsers.length > 0) {
      console.log('Usuário já existe:', existingUsers[0]);
      return existingUsers[0];
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
    
    console.log('Usuário criado com sucesso:', newUser);
    return newUser;
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUser()
    .then(() => {
      console.log('Script concluído');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erro no script:', error);
      process.exit(1);
    });
}

export { createTestUser };
