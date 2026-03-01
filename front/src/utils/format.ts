// ============================================================
// utils/format.ts
// Funções utilitárias de formatação usadas em toda a aplicação
// ============================================================

/**
 * Formata um número como moeda BRL.
 * Ex.: 1234.5 → "R$ 1.234,50"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Retorna a classe CSS correta para um valor monetário:
 * - Positivo → verde
 * - Negativo → vermelho
 * - Zero     → neutro
 */
export function saldoClass(value: number): string {
  if (value > 0) return 'valor-positivo';
  if (value < 0) return 'valor-negativo';
  return 'valor-neutro';
}

/** Mapeia o tipo de transação para label em português */
export const tipoLabel: Record<string, string> = {
  receita: 'Receita',
  despesa: 'Despesa',
};

/** Mapeia a finalidade da categoria para label em português */
export const finalidadeLabel: Record<string, string> = {
  receita: 'Receita',
  despesa: 'Despesa',
  ambas: 'Ambas',
};
