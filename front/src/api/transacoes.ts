import api from '@/lib/axios'
import { tipoToNumber } from '@/utils/format'
import type { Transacao, PagedResult, CreateTransacaoDto, UpdateTransacaoDto } from '@/types'

const BASE = '/api/transacoes'

export const transacoesApi = {
  list: (page = 1, pageSize = 10): Promise<PagedResult<Transacao>> =>
    api.get(BASE, { params: { page, pageSize } }).then(r => r.data),

  create: (dto: CreateTransacaoDto): Promise<Transacao> =>
    api.post(BASE, {
      ...dto,
      tipo: tipoToNumber[dto.tipo],
    }).then(r => r.data),

  update: (id: number, dto: UpdateTransacaoDto): Promise<Transacao> =>
    api.put(`${BASE}/${id}`, {
      ...dto,
      tipo: tipoToNumber[dto.tipo],
    }).then(r => r.data),
}