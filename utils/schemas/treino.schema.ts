import { z } from 'zod';
import { SentimentoSchema, TipoTreinoSchema } from './enums';

// Schema base para treino (usado tanto no frontend quanto no backend)
export const TreinoSchema = z.object({
  data: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data inválida. Use um formato de data válido (ex: YYYY-MM-DD)'
  }),
  duracao: z.union([
    z.number().int().positive({
      message: 'Duração deve ser um número inteiro positivo (em minutos)'
    }),
    z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: 'Duração deve ser um número inteiro positivo (em minutos)'
    })
  ]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  tipo: TipoTreinoSchema,
  professor: z.string().min(1, 'Nome do professor não pode ser vazio').optional().nullable(),
  tecnicasAprendidas: z.string().optional().nullable(),
  sentimento: SentimentoSchema.optional().nullable(),
  observacoes: z.string().optional().nullable()
});

// Schema para criação de treino (todos os campos obrigatórios exceto os opcionais)
export const CreateTreinoSchema = TreinoSchema;

// Schema para atualização de treino (todos os campos opcionais)
export const UpdateTreinoSchema = TreinoSchema.partial();

// Schema para ID de treino (usado em parâmetros de rota)
export const TreinoIdSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'ID do treino deve ser um número positivo'
  })
});

// Tipos inferidos para uso no TypeScript
export type TreinoForm = z.infer<typeof TreinoSchema>;
export type CreateTreinoInput = z.infer<typeof CreateTreinoSchema>;
export type UpdateTreinoInput = z.infer<typeof UpdateTreinoSchema>;
export type TreinoIdParams = z.infer<typeof TreinoIdSchema>;
