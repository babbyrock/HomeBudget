using HomeBudget.Application.Common;
using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Domain.Enums;
using HomeBudget.Domain.Interfaces;
using MediatR;

namespace HomeBudget.Application.Categorias.GetTotaisPorCategoria
{
    /// <summary>
    /// Agrupa transações por categoria, calcula totais e pagina o resultado.
    /// O total geral é calculado antes da paginação para refletir todas as categorias.
    /// </summary>
    public class GetTotaisPorCategoriaHandler(ITransacaoRepository repository)
        : IRequestHandler<GetTotaisPorCategoriaQuery, TotaisCategoriasResultDto>
    {
        public async Task<TotaisCategoriasResultDto> Handle(
            GetTotaisPorCategoriaQuery request, CancellationToken ct)
        {
            var transacoes = await repository.GetTransacoesComCategoria(ct);

            var todosOsTotais = transacoes
                .GroupBy(t => t.CategoriaId)
                .Select(g => new TotalCategoriaDto
                {
                    Id = g.First().Categoria.Id,
                    Descricao = g.First().Categoria.Descricao,
                    TotalReceitas = g.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                    TotalDespesas = g.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                    Saldo = g.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor)
                           - g.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
                }).ToList();

            var totalGeralReceitas = todosOsTotais.Sum(c => c.TotalReceitas);
            var totalGeralDespesas = todosOsTotais.Sum(c => c.TotalDespesas);

            var itensPaginados = todosOsTotais
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            return new TotaisCategoriasResultDto
            {
                Categorias = new PagedResult<TotalCategoriaDto>(itensPaginados, todosOsTotais.Count, request.Page, request.PageSize),
                TotalGeralReceitas = totalGeralReceitas,
                TotalGeralDespesas = totalGeralDespesas,
                SaldoLiquido = totalGeralReceitas - totalGeralDespesas
            };
        }
    }
}