// ============================================================
// schemas/index.ts
// Schemas Zod para validação dos formulários via react-hook-form.
// Os mesmos critérios aplicados pelo backend são reforçados aqui.
// ============================================================

import { z } from 'zod'

// ---------- Pessoa ----------
export const pessoaSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),
  idade: z
    .number({ invalid_type_error: 'Informe um número' })
    .int('Idade deve ser um número inteiro')
    .min(0, 'Idade inválida')
    .max(150, 'Idade inválida'),
})

export type PessoaFormValues = z.infer<typeof pessoaSchema>

// ---------- Categoria ----------
export const categoriaSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(400, 'Descrição deve ter no máximo 400 caracteres')
    .trim(),
  finalidade: z.enum(['despesa', 'receita', 'ambas'], {
    errorMap: () => ({ message: 'Selecione uma finalidade' }),
  }),
})

export type CategoriaFormValues = z.infer<typeof categoriaSchema>

// ---------- Transação ----------
export const transacaoSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(400, 'Descrição deve ter no máximo 400 caracteres')
    .trim(),
  valor: z
    .number({ invalid_type_error: 'Informe um valor' })
    .positive('Valor deve ser maior que zero'),
  tipo: z.enum(['despesa', 'receita'], {
    errorMap: () => ({ message: 'Selecione o tipo' }),
  }),
  pessoaId: z.string().min(1, 'Selecione uma pessoa'),
  categoriaId: z.string().min(1, 'Selecione uma categoria'),
})

export type TransacaoFormValues = z.infer<typeof transacaoSchema>