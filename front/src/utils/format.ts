export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function saldoClass(value: number): string {
  if (value > 0) return 'valor-positivo';
  if (value < 0) return 'valor-negativo';
  return 'valor-neutro';
}

export const tipoLabel: Record<string, string> = {
  receita: 'Receita',
  despesa: 'Despesa',
};

export const tipoToNumber: Record<string, number> = {
  'despesa': 0,
  'receita': 1,
}

export const finalidadeLabel: Record<string, string> = {
  'Despesa': 'Despesa',
  'Receita': 'Receita',
  'Ambas':   'Ambas',
}

export const finalidadeToNumber: Record<string, number> = {
  'Despesa': 0,
  'Receita': 1,
  'Ambas':   2,
}
