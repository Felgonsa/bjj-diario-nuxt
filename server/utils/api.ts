// Utilitários para padronização de respostas da API

// Tipos de resposta padrão
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Função para criar resposta de sucesso
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  
  if (message) {
    response.message = message;
  }
  
  // Se data for um array, adicionar count
  if (Array.isArray(data)) {
    response.count = data.length;
  }
  
  return response;
}

// Função para criar resposta de erro
export function createErrorResponse(message: string, error?: any): ApiResponse {
  const response: ApiResponse = {
    success: false,
    error: message
  };
  
  if (error && process.env.NODE_ENV === 'development') {
    response.data = error;
  }
  
  return response;
}

// Validações comuns
export const validators = {
  // Validar se é um número positivo
  isPositiveNumber(value: any): boolean {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  },
  
  // Validar se é uma data válida
  isValidDate(value: any): boolean {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  },
  
  // Validar enum
  isValidEnum(value: string, validValues: string[]): boolean {
    return validValues.includes(value);
  },
  
  // Validar string não vazia
  isNonEmptyString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }
};

// Constantes para validação
export const validationConstants = {
  // Tipos de treino válidos
  TIPOS_TREINO: ['com_kimono', 'sem_kimono', 'drills', 'open_mat'],
  
  // Sentimentos válidos
  SENTIMENTOS: ['cansado', 'forte', 'destruido', 'tecnico', 'normal'],
  
  // Resultados de rola válidos
  RESULTADOS_ROLA: ['finalizei', 'fui_finalizado', 'empate'],
  
  // Graduações (faixas) válidas
  GRADUACOES: [
    'branca', 'cinza_com_branca', 'cinza', 'cinza_com_preta',
    'amarela_com_branca', 'amarela', 'amarela_com_preta',
    'laranja_com_branca', 'laranja', 'laranja_com_preta',
    'verde_com_branca', 'verde', 'verde_com_preta',
    'azul', 'roxa', 'marrom', 'preta'
  ]
};

// Funções de validação específicas
export const validateTreino = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.data || !validators.isValidDate(data.data)) {
    errors.push('Data do treino é obrigatória e deve ser uma data válida');
  }
  
  if (!data.duracao || !validators.isPositiveNumber(data.duracao)) {
    errors.push('Duração é obrigatória e deve ser um número positivo');
  }
  
  if (!data.tipo || !validators.isValidEnum(data.tipo, validationConstants.TIPOS_TREINO)) {
    errors.push(`Tipo de treino é obrigatório. Tipos válidos: ${validationConstants.TIPOS_TREINO.join(', ')}`);
  }
  
  if (data.sentimento && !validators.isValidEnum(data.sentimento, validationConstants.SENTIMENTOS)) {
    errors.push(`Sentimento inválido. Sentimentos válidos: ${validationConstants.SENTIMENTOS.join(', ')}`);
  }
  
  return errors;
};

export const validateRola = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.treinoId || !validators.isPositiveNumber(data.treinoId)) {
    errors.push('ID do treino é obrigatório e deve ser um número positivo');
  }
  
  if (!data.nomeParceiro || !validators.isNonEmptyString(data.nomeParceiro)) {
    errors.push('Nome do parceiro é obrigatório');
  }
  
  if (!data.graduacaoParceiro || !validators.isValidEnum(data.graduacaoParceiro, validationConstants.GRADUACOES)) {
    errors.push(`Graduação do parceiro é obrigatória. Graduações válidas: ${validationConstants.GRADUACOES.join(', ')}`);
  }
  
  if (!data.resultado || !validators.isValidEnum(data.resultado, validationConstants.RESULTADOS_ROLA)) {
    errors.push(`Resultado da rola é obrigatório. Resultados válidos: ${validationConstants.RESULTADOS_ROLA.join(', ')}`);
  }
  
  if (data.duracao && !validators.isPositiveNumber(data.duracao)) {
    errors.push('Duração deve ser um número positivo');
  }
  
  return errors;
};

// Helper para parse de query parameters
export function parseQueryParams(query: any) {
  return {
    page: query.page ? parseInt(query.page) : 1,
    limit: query.limit ? parseInt(query.limit) : 20,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    search: query.search || ''
  };
}