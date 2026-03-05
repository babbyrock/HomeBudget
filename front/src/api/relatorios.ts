import axios from 'axios'

export const relatoriosApi = {
  porPessoa: (page = 1, pageSize = 10) =>
    axios.get('/api/pessoas/totais', { params: { page, pageSize } }).then(r => r.data),

  porCategoria: (page = 1, pageSize = 10) =>
    axios.get('/api/categorias/totais', { params: { page, pageSize } }).then(r => r.data),
}