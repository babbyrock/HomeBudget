// ============================================================
// types/index.ts
// Tipos centrais — espelham os modelos/DTOs da WebAPI C#/.NET
// ============================================================

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface CreatePessoaDto {
  nome: string;
  idade: number;
}

export type Finalidade = 'despesa' | 'receita' | 'ambas';

export interface Categoria {
  id: string;
  descricao: string;
  finalidade: Finalidade;
}

export interface CreateCategoriaDto {
  descricao: string;
  finalidade: Finalidade;
}

export type TipoTransacao = 'despesa' | 'receita';

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  pessoaId: string;
  // campos expandidos (JOIN no backend)
  categoriaNome?: string;
  pessoaNome?: string;
}

export interface CreateTransacaoDto {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  pessoaId: string;
}

// Relatórios
export interface TotalPessoa {
  pessoaId: string;
  pessoaNome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface RelatorioTotaisPorPessoa {
  itens: TotalPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}

export interface TotalCategoria {
  categoriaId: string;
  categoriaNome: string;
  finalidade: Finalidade;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface RelatorioTotaisPorCategoria {
  itens: TotalCategoria[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}