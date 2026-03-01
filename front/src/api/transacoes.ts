// ============================================================
// api/transacoes.ts
// Espelha: GET /api/transacoes, POST /api/transacoes
//
// Regras de negócio:
//  1. Pessoa menor de 18 → só aceita tipo=despesa
//  2. Categoria deve ser compatível com o tipo:
//     - despesa: finalidade deve ser 'despesa' ou 'ambas'
//     - receita: finalidade deve ser 'receita' ou 'ambas'
// ============================================================

import { db, delay, uuid } from './mockDb'
import type { Transacao, CreateTransacaoDto } from '../types'

const enrich = (t: Transacao): Transacao => ({
  ...t,
  pessoaNome:    db.pessoas.find((p) => p.id === t.pessoaId)?.nome ?? '—',
  categoriaNome: db.categorias.find((c) => c.id === t.categoriaId)?.descricao ?? '—',
})

export const transacoesApi = {
  /** GET /api/transacoes */
  list: async (): Promise<Transacao[]> => {
    await delay()
    return db.transacoes.map(enrich)
  },

  /** POST /api/transacoes — valida regras de negócio */
  create: async (dto: CreateTransacaoDto): Promise<Transacao> => {
    await delay()

    const pessoa = db.pessoas.find((p) => p.id === dto.pessoaId)
    if (!pessoa) throw new Error('Pessoa não encontrada')

    // Regra 1: menor de 18 só pode ter despesas
    if (pessoa.idade < 18 && dto.tipo !== 'despesa') {
      throw new Error(`${pessoa.nome} tem menos de 18 anos e só pode registrar despesas.`)
    }

    const categoria = db.categorias.find((c) => c.id === dto.categoriaId)
    if (!categoria) throw new Error('Categoria não encontrada')

    // Regra 2: compatibilidade categoria × tipo
    const incompativel =
      (dto.tipo === 'despesa' && categoria.finalidade === 'receita') ||
      (dto.tipo === 'receita' && categoria.finalidade === 'despesa')

    if (incompativel) {
      throw new Error(
        `A categoria "${categoria.descricao}" (${categoria.finalidade}) não é compatível com o tipo "${dto.tipo}".`
      )
    }

    const nova: Transacao = { id: uuid(), ...dto }
    db.transacoes.push(nova)
    return enrich(nova)
  },
}