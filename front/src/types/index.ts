export interface Pessoa {
  id: number
  nome: string
  idade: number
}

export interface CreatePessoaDto {
  nome: string
  idade: number
}

export interface PagedResult<T> {
  items: T[]
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export type Finalidade = 'Despesa' | 'Receita' | 'Ambas'

export interface Categoria {
  id: number
  descricao: string
  finalidade: Finalidade
}

export interface CreateCategoriaDto {
  descricao: string
  finalidade: Finalidade
}

export interface UpdateCategoriaDto {
  descricao: string
  finalidade: Finalidade
}

export type TipoTransacao = 'Despesa' | 'Receita'

export interface Transacao {
  id: number
  descricao: string
  valor: number
  tipo: TipoTransacao
  nomePessoa: string      
  nomeCategoria: string   
}

export interface CreateTransacaoDto {
  descricao: string
  valor: number
  tipo: TipoTransacao
  categoriaId: number
  pessoaId: number
}

export interface UpdateTransacaoDto {
  descricao: string
  valor: number
  tipo: TipoTransacao
  categoriaId: number
  pessoaId: number
}

export interface TotalPessoa {
  id: number
  nome: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export interface TotaisPessoasResultDto {
  pessoas: PagedResult<TotalPessoa>
  totalGeralReceitas: number
  totalGeralDespesas: number
  saldoLiquido: number
}

export interface TotalCategoria {
  id: number
  descricao: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export interface TotaisCategoriasResultDto {
  categorias: PagedResult<TotalCategoria>
  totalGeralReceitas: number
  totalGeralDespesas: number
  saldoLiquido: number
}