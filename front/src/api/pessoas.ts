// ============================================================
// api/pessoas.ts
// Funções que serão chamadas pelo React Query.
// Espelha: GET /api/pessoas, POST, PUT /api/pessoas/:id, DELETE
// ============================================================

import type { CreatePessoaDto, Pessoa } from '../types'
import { db, delay, uuid } from './mockDb'

export const pessoasApi = {
  /** GET /api/pessoas */
  list: async (): Promise<Pessoa[]> => {
    await delay()
    return [...db.pessoas]
  },

  /** POST /api/pessoas */
  create: async (dto: CreatePessoaDto): Promise<Pessoa> => {
    await delay()
    const nova: Pessoa = { id: uuid(), ...dto }
    db.pessoas.push(nova)
    return nova
  },

  /** PUT /api/pessoas/:id */
  update: async (id: string, dto: CreatePessoaDto): Promise<Pessoa> => {
    await delay()
    const idx = db.pessoas.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error('Pessoa não encontrada')
    db.pessoas[idx] = { ...db.pessoas[idx], ...dto }
    return db.pessoas[idx]
  },

  /**
   * DELETE /api/pessoas/:id
   * Regra: ao deletar, remove todas as transações dessa pessoa (cascata)
   */
  delete: async (id: string): Promise<void> => {
    await delay()
    const idx = db.pessoas.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error('Pessoa não encontrada')
    db.transacoes = db.transacoes.filter((t) => t.pessoaId !== id)
    db.pessoas.splice(idx, 1)
  },
}