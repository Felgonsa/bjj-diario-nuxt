import { z } from 'zod';
import { FaixaSchema, ResultadoRolaSchema } from './enums';

// Schema base para rola (usado tanto no frontend quanto no backend)
export const RolaSchema = z.object({
  treinoId: z.union([
    z.number().int().positive({
      message: 'ID do treino deve ser um número positivo'
    }),
    z.string().min(1, 'ID do treino é obrigatório').refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      { message: 'ID do treino deve ser um número positivo' }
    )
  ]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  nomeParceiro: z.string().min(3, 'Nome do parceiro deve ter pelo menos 3 caracteres'),
  graduacaoParceiro: FaixaSchema,
  resultado: ResultadoRolaSchema,
  formaFinalizacao: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
  duracao: z.union([
    z.number().int().positive({
      message: 'Duração deve ser um número inteiro positivo (em minutos)'
    }),
    z.string().refine(
      (val) => val === '' || (!isNaN(parseInt(val)) && parseInt(val) > 0),
      { message: 'Duração deve ser um número inteiro positivo ou vazio' }
    )
  ]).transform((val) => val === '' ? null : (typeof val === 'string' ? parseInt(val) : val)).optional().nullable()
});

// Schema para criação de rola (todos os campos obrigatórios exceto os opcionais)
export const CreateRolaSchema = RolaSchema;

// Schema para atualização de rola (todos os campos opcionais)
export const UpdateRolaSchema = RolaSchema.partial();

// Schema para ID de rola (usado em parâmetros de rota)
export const RolaIdSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'ID da rola deve ser um número positivo'
  })
});

// Schema para validação de treinoId em parâmetros de query
export const TreinoIdQuerySchema = z.object({
  treinoId: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'treinoId deve ser um número positivo'
  })
});

// Tipos inferidos para uso no TypeScript
export type RolaForm = z.infer<typeof RolaSchema>;
export type CreateRolaInput = z.infer<typeof CreateRolaSchema>;
export type UpdateRolaInput = z.infer<typeof UpdateRolaSchema>;
export type RolaIdParams = z.infer<typeof RolaIdSchema>;
export type TreinoIdQueryParams = z.infer<typeof TreinoIdQuerySchema>;
