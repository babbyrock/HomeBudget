import axios from 'axios'
import type { Pessoa, PagedResult, CreatePessoaDto } from '@/types'

const BASE = '/api/pessoas'

export const pessoasApi = {
  list: (page = 1, pageSize = 10): Promise<PagedResult<Pessoa>> =>
    axios.get(BASE, { params: { page, pageSize } }).then(r => r.data),

  create: (dto: CreatePessoaDto): Promise<Pessoa> =>
    axios.post(BASE, dto).then(r => r.data),

  update: (id: number, dto: CreatePessoaDto): Promise<Pessoa> =>
    axios.put(`${BASE}/${id}`, dto).then(r => r.data),

  delete: (id: number): Promise<void> =>
    axios.delete(`${BASE}/${id}`).then(r => r.data),

  totais: (page = 1, pageSize = 10) =>
    axios.get(`${BASE}/totais`, { params: { page, pageSize } }).then(r => r.data),
}