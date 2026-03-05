export const queryKeys = {
  pessoas:    (page = 1, pageSize = 10) => ['pessoas', page, pageSize] as const,
  categorias: (page = 1, pageSize = 10) => ['categorias', page, pageSize] as const,
  transacoes: (page = 1, pageSize = 10) => ['transacoes', page, pageSize] as const,
  relatorioPorPessoa:    (page = 1, pageSize = 10) => ['relatorio', 'pessoas', page, pageSize] as const,
  relatorioPorCategoria: (page = 1, pageSize = 10) => ['relatorio', 'categorias', page, pageSize] as const,
}