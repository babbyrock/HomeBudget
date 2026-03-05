import api from '@/lib/axios'
import { finalidadeToNumber } from '@/utils/format'
import type { Categoria, PagedResult, CreateCategoriaDto, UpdateCategoriaDto } from '@/types'

const BASE = '/api/categorias'

export const categoriasApi = {
  list: (page = 1, pageSize = 10): Promise<PagedResult<Categoria>> =>
    api.get(BASE, { params: { page, pageSize } }).then(r => r.data),

  create: (dto: CreateCategoriaDto): Promise<Categoria> =>
    api.post(BASE, {
      ...dto,
      finalidade: finalidadeToNumber[dto.finalidade],
    }).then(r => r.data),

  update: (id: number, dto: UpdateCategoriaDto): Promise<Categoria> =>
    api.put(`${BASE}/${id}`, {
      ...dto,
      finalidade: finalidadeToNumber[dto.finalidade],
    }).then(r => r.data),

  totais: (page = 1, pageSize = 10) =>
    api.get(`${BASE}/totais`, { params: { page, pageSize } }).then(r => r.data),
}