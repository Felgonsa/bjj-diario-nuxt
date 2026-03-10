import { createError } from 'h3';
import { z } from 'zod';

/**
 * Utilitário para validação com Zod com tratamento de erros padronizado
 */
export class ValidationError extends Error {
  constructor(
    public errors: z.ZodIssue[],
    message = 'Erro de validação'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Valida dados com um schema Zod e retorna os dados validados
 * @throws {ValidationError} Se a validação falhar
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    throw new ValidationError(result.error.issues);
  }
  
  return result.data;
}

/**
 * Valida dados com um schema Zod e cria um erro HTTP 400 se falhar
 * @throws {ReturnType<typeof createError>} Erro HTTP 400 com detalhes da validação
 */
export function validateWithHttpError<T>(
  schema: z.ZodSchema<T>, 
  data: unknown, 
  context = 'Dados inválidos'
): T {
  try {
    return validate(schema, data);
  } catch (error) {
    if (error instanceof ValidationError) {
      // Formatar mensagens de erro para serem mais amigáveis
      const errorMessages = error.errors.map(err => {
        const path = err.path.join('.');
        return path ? `${path}: ${err.message}` : err.message;
      });
      
      throw createError({
        statusCode: 400,
        statusMessage: `${context}: ${errorMessages.join('; ')}`
      });
    }
    
    // Se não for um ValidationError, rethrow
    throw error;
  }
}

/**
 * Valida parâmetros de rota (string) e converte para número se necessário
 */
export function validateRouteParams<T>(
  schema: z.ZodSchema<T>,
  params: Record<string, string>
): T {
  return validate(schema, params);
}

/**
 * Valida query parameters
 */
export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  query: Record<string, string | string[]>
): T {
  return validate(schema, query);
}