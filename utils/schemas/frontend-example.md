# Exemplo de Uso dos Schemas no Frontend

Agora que temos schemas Zod compartilhados em `utils/schemas/`, podemos usá-los tanto no backend quanto no frontend. Aqui estão alguns exemplos:

## 1. Validação de Formulário no Frontend

```vue
<script setup lang="ts">
// O Nuxt auto-importa os schemas de utils/schemas/
import { RolaSchema, TreinoSchema } from '~/utils/schemas';

const formRola = ref({
  treinoId: '',
  nomeParceiro: '',
  graduacaoParceiro: 'branca',
  resultado: 'empate',
  formaFinalizacao: '',
  notas: '',
  duracao: ''
});

const errors = ref<string[]>([]);

const salvarRola = async () => {
  // Limpar erros anteriores
  errors.value = [];
  
  // Validar com Zod ANTES de enviar para o backend
  const validacao = RolaSchema.safeParse(formRola.value);
  
  if (!validacao.success) {
    // Coletar mensagens de erro amigáveis
    errors.value = validacao.error.issues.map(issue => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    });
    return;
  }
  
  // Dados validados - agora podemos enviar para o backend
  try {
    const response = await $fetch('/api/rolas/create', {
      method: 'POST',
      body: validacao.data
    });
    
    console.log('Rola criada com sucesso:', response);
    // Limpar formulário ou redirecionar
  } catch (error: any) {
    console.error('Erro ao criar rola:', error);
    errors.value = [error.data?.message || 'Erro ao salvar rola'];
  }
};
</script>

<template>
  <form @submit.prevent="salvarRola">
    <div v-for="error in errors" :key="error" class="error">
      {{ error }}
    </div>
    
    <input v-model="formRola.nomeParceiro" placeholder="Nome do parceiro" />
    <!-- ... outros campos ... -->
    
    <button type="submit">Salvar</button>
  </form>
</template>
```

## 2. Tipagem TypeScript Automática

```typescript
// Em qualquer componente ou composable
import type { RolaForm, TreinoForm } from '~/utils/schemas';

// Use os tipos inferidos automaticamente
const novaRola: RolaForm = {
  treinoId: 1,
  nomeParceiro: 'João',
  graduacaoParceiro: 'azul',
  resultado: 'finalizei',
  // ... outros campos com autocomplete do TypeScript
};

// Validação em tempo real
const validarCampo = (campo: keyof RolaForm, valor: any) => {
  const resultado = RolaSchema.shape[campo].safeParse(valor);
  return resultado.success ? null : resultado.error.errors[0].message;
};
```

## 3. Composables para Validação Reutilizável

```typescript
// composables/useFormValidation.ts
import { RolaSchema, TreinoSchema } from '~/utils/schemas';

export function useFormValidation() {
  const validateRola = (data: any) => {
    return RolaSchema.safeParse(data);
  };
  
  const validateTreino = (data: any) => {
    return TreinoSchema.safeParse(data);
  };
  
  const getFieldErrors = (validationResult: any) => {
    if (validationResult.success) return {};
    
    const errors: Record<string, string> = {};
    validationResult.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      if (path) errors[path] = issue.message;
    });
    
    return errors;
  };
  
  return {
    validateRola,
    validateTreino,
    getFieldErrors
  };
}
```

## 4. Benefícios Dessa Abordagem

### ✅ **Código DRY (Don't Repeat Yourself)**
- Mesmas regras no frontend e backend
- Se mudar uma regra, muda em um só lugar

### ✅ **Type Safety Completo**
- TypeScript conhece todos os tipos
- Autocomplete no VS Code
- Erros em tempo de compilação

### ✅ **Mensagens de Erro Consistentes**
- Mesmas mensagens no formulário e na API
- Traduzidas para português
- Descritivas e amigáveis

### ✅ **Documentação Viva**
- Schemas servem como documentação
- Fácil de entender as regras de negócio
- Novos desenvolvedores entendem rápido

## 5. Próximos Passos

1. **Criar componentes de formulário reutilizáveis** que usem os schemas
2. **Adicionar validação em tempo real** nos campos
3. **Criar testes unitários** para os schemas
4. **Documentar todos os schemas** com exemplos de uso

## Conclusão

Com essa arquitetura, você garante que:
- O usuário vê erros antes de enviar o formulário
- O backend rejeita dados inválidos com as mesmas mensagens
- O código é mais fácil de manter e evoluir
- A qualidade dos dados no banco é garantida