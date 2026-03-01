// ============================================================
// api/mockDb.ts
// "Banco de dados" em memória para desenvolvimento/mock.
// Para usar a API real: remova este arquivo e ajuste os
// serviços para chamadas axios em /api/...
// ============================================================

import type { Pessoa, Categoria, Transacao } from '../types'

export const delay = (ms = 280) =>
  new Promise<void>((r) => setTimeout(r, ms))

export const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })

// ---- Seed ----
const p1 = uuid(), p2 = uuid(), p3 = uuid()
const c1 = uuid(), c2 = uuid(), c3 = uuid(), c4 = uuid()

export const db = {
  pessoas: [
    { id: p1, nome: 'Ana Paula Ferreira', idade: 34 },
    { id: p2, nome: 'Bruno Mendes',       idade: 17 },
    { id: p3, nome: 'Carla Souza',        idade: 28 },
  ] as Pessoa[],

  categorias: [
    { id: c1, descricao: 'Salário',          finalidade: 'receita' },
    { id: c2, descricao: 'Alimentação',      finalidade: 'despesa' },
    { id: c3, descricao: 'Transporte',       finalidade: 'despesa' },
    { id: c4, descricao: 'Investimentos',    finalidade: 'ambas'   },
  ] as Categoria[],

  transacoes: [
    { id: uuid(), descricao: 'Salário de Janeiro', valor: 6500, tipo: 'receita', categoriaId: c1, pessoaId: p1 },
    { id: uuid(), descricao: 'Supermercado',        valor: 520,  tipo: 'despesa', categoriaId: c2, pessoaId: p1 },
    { id: uuid(), descricao: 'Transporte mensal',   valor: 180,  tipo: 'despesa', categoriaId: c3, pessoaId: p1 },
    { id: uuid(), descricao: 'Mesada',               valor: 400,  tipo: 'despesa', categoriaId: c2, pessoaId: p2 },
    { id: uuid(), descricao: 'Freelance design',     valor: 2200, tipo: 'receita', categoriaId: c4, pessoaId: p3 },
    { id: uuid(), descricao: 'Almoço semana',        valor: 290,  tipo: 'despesa', categoriaId: c2, pessoaId: p3 },
  ] as Transacao[],
}