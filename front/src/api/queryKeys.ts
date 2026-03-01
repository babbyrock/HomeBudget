// ============================================================
// api/queryKeys.ts
// Chaves centralizadas do React Query.
// Facilita invalidação de cache após mutations.
// ============================================================

export const queryKeys = {
  pessoas:    ['pessoas']    as const,
  categorias: ['categorias'] as const,
  transacoes: ['transacoes'] as const,
  relatorioPorPessoa:    ['relatorio', 'pessoas']    as const,
  relatorioPorCategoria: ['relatorio', 'categorias'] as const,
}