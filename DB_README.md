# Banco de Dados - BJJ Diário

Este projeto utiliza **PostgreSQL** com **Drizzle ORM** para gerenciamento do banco de dados.

## Estrutura do Banco

### Tabelas Principais

1. **usuarios** - Informações dos praticantes
   - `id`, `nome`, `email`, `senha`
   - `faixa` (enum: branca, azul, roxa, marrom, preta)
   - `graus` (0-4), `equipe`, `peso_atual`
   - Datas de cadastro e atualização

2. **treinos** - Registro de sessões de treino
   - `id`, `usuario_id` (FK), `data`, `duracao` (minutos)
   - `tipo` (enum: com_kimono, sem_kimono, drills, open_mat)
   - `professor`, `tecnicas_aprendidas`, `sentimento`, `observacoes`

3. **rolas** - Detalhes de sparring/lutas
   - `id`, `treino_id` (FK), `nome_parceiro`
   - `graduacao_parceiro`, `resultado` (finalizei, fui_finalizado, empate)
   - `forma_finalizacao`, `notas`, `duracao`

4. **faixas** - Tabela de referência (cores e hierarquia)
   - `id`, `nome`, `categoria`, `cor_hex`, `ordem`

## Configuração

### 1. Instalação de Dependências

```bash
npm install drizzle-orm drizzle-kit postgres
```

### 2. Configuração do Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# Para Neon PostgreSQL
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require

# Ou variáveis individuais
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bjj_diario
DB_SSL=false
```

### 3. Scripts Disponíveis

```bash
# Gerar migrações (cria arquivos SQL no diretório ./drizzle)
npm run db:generate

# Executar migrações no banco
npm run db:migrate

# Abrir Drizzle Studio (interface visual)
npm run db:studio

# Push direto do schema (apenas desenvolvimento)
npm run db:push
```

### 4. Primeira Execução

```bash
# 1. Configure as variáveis de ambiente no .env
# 2. Gere as migrações
npm run db:generate

# 3. Execute as migrações no banco
npm run db:migrate

# 4. (Opcional) Use o Drizzle Studio para visualizar dados
npm run db:studio
```

## Tipos TypeScript

Os tipos estão definidos em:

- `db/schema.ts` - Tipos do Drizzle (backend)
- `utils/types.ts` - Tipos compatíveis com frontend
- `db/index.ts` - Exportação centralizada

## Estrutura de Arquivos

```
db/
├── schema.ts          # Definição do schema Drizzle
├── index.ts           # Conexão e exportação
drizzle.config.ts      # Configuração do Drizzle Kit
.env.example          # Exemplo de variáveis de ambiente
```

## Migrações

As migrações são versionadas e ficam no diretório `./drizzle/`. Cada migração é um arquivo SQL que pode ser aplicado/revertido.

## Drizzle Studio

Interface web para visualizar e editar dados:

```bash
npm run db:studio
# Acesse http://localhost:4983
```

## Considerações para Produção

1. **Neon PostgreSQL**: Use a string de conexão fornecida pelo dashboard
2. **Pool de Conexões**: Configurado para máximo 10 conexões
3. **SSL**: Habilitado por padrão no Neon
4. **Backups**: Configure backups automáticos no Neon

## Próximos Passos

1. Criar API para operações CRUD
2. Implementar autenticação (JWT)
3. Adicionar seed data para faixas
4. Criar views/materialized views para estatísticas