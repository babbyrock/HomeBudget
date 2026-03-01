// ============================================================
// api/relatorios.ts
// Espelha: GET /api/relatorios/por-pessoa
//          GET /api/relatorios/por-categoria
// ============================================================

import { db, delay } from './mockDb'
import type { RelatorioTotaisPorPessoa, RelatorioTotaisPorCategoria } from '../types'

export const relatoriosApi = {
  /** GET /api/relatorios/por-pessoa */
  porPessoa: async (): Promise<RelatorioTotaisPorPessoa> => {
    await delay()

    const itens = db.pessoas.map((pessoa) => {
      const ts = db.transacoes.filter((t) => t.pessoaId === pessoa.id)
      const totalReceitas = ts.filter((t) => t.tipo === 'receita').reduce((a, t) => a + t.valor, 0)
      const totalDespesas = ts.filter((t) => t.tipo === 'despesa').reduce((a, t) => a + t.valor, 0)
      return { pessoaId: pessoa.id, pessoaNome: pessoa.nome, totalReceitas, totalDespesas, saldo: totalReceitas - totalDespesas }
    })

    return {
      itens,
      totalGeralReceitas: itens.reduce((a, i) => a + i.totalReceitas, 0),
      totalGeralDespesas: itens.reduce((a, i) => a + i.totalDespesas, 0),
      saldoLiquido: itens.reduce((a, i) => a + i.saldo, 0),
    }
  },

  /** GET /api/relatorios/por-categoria */
  porCategoria: async (): Promise<RelatorioTotaisPorCategoria> => {
    await delay()

    const itens = db.categorias.map((cat) => {
      const ts = db.transacoes.filter((t) => t.categoriaId === cat.id)
      const totalReceitas = ts.filter((t) => t.tipo === 'receita').reduce((a, t) => a + t.valor, 0)
      const totalDespesas = ts.filter((t) => t.tipo === 'despesa').reduce((a, t) => a + t.valor, 0)
      return { categoriaId: cat.id, categoriaNome: cat.descricao, finalidade: cat.finalidade, totalReceitas, totalDespesas, saldo: totalReceitas - totalDespesas }
    })

    return {
      itens,
      totalGeralReceitas: itens.reduce((a, i) => a + i.totalReceitas, 0),
      totalGeralDespesas: itens.reduce((a, i) => a + i.totalDespesas, 0),
      saldoLiquido: itens.reduce((a, i) => a + i.saldo, 0),
    }
  },
}