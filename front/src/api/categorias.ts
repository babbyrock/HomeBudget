// ============================================================
// api/categorias.ts
// Espelha: GET /api/categorias, POST /api/categorias
// ============================================================

import { db, delay, uuid } from './mockDb'
import type { Categoria, CreateCategoriaDto } from '../types'

export const categoriasApi = {
  /** GET /api/categorias */
  list: async (): Promise<Categoria[]> => {
    await delay()
    return [...db.categorias]
  },

  /** POST /api/categorias */
  create: async (dto: CreateCategoriaDto): Promise<Categoria> => {
    await delay()
    const nova: Categoria = { id: uuid(), ...dto }
    db.categorias.push(nova)
    return nova
  },
}