import { z } from 'zod'

export const pessoaSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),
  idade: z
    .number({ message: 'Informe um número' })
    .int('Idade deve ser um número inteiro')
    .min(0, 'Idade inválida')
    .max(150, 'Idade inválida'),
})

export type PessoaFormValues = z.infer<typeof pessoaSchema>

const categoriaBaseSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(400, 'Descrição deve ter no máximo 400 caracteres')
    .trim(),
  finalidade: z.enum(['Despesa', 'Receita', 'Ambas'], {
    message: 'Selecione uma finalidade',
  }),
})

export const categoriaSchema = categoriaBaseSchema

export type CategoriaFormInput = z.input<typeof categoriaBaseSchema>
export type CategoriaFormValues = z.output<typeof categoriaBaseSchema>

const transacaoBaseSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(400, 'Descrição deve ter no máximo 400 caracteres')
    .trim(),
  valor: z.coerce
    .number({ message: 'Informe um valor' })
    .positive('Valor deve ser maior que zero'),
  tipo: z.enum(['Despesa', 'Receita'], {
    message: 'Selecione o tipo',
  }),
  pessoaId: z.coerce
    .number({ message: 'Selecione uma pessoa' })
    .min(1, 'Selecione uma pessoa'),
  categoriaId: z.coerce
    .number({ message: 'Selecione uma categoria' })
    .min(1, 'Selecione uma categoria'),
})

export const transacaoSchema = transacaoBaseSchema

export type TransacaoFormInput = z.input<typeof transacaoBaseSchema>
export type TransacaoFormValues = z.output<typeof transacaoBaseSchema>