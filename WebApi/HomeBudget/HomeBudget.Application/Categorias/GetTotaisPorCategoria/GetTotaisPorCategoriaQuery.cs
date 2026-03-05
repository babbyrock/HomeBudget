// HomeBudget.Application/Categorias/GetTotaisPorCategoria/GetTotaisPorCategoriaQuery.cs
using HomeBudget.Application.Categorias.DTOs;
using MediatR;

namespace HomeBudget.Application.Categorias.GetTotaisPorCategoria
{
    /// <summary>
    /// Query para obter totais de receitas, despesas e saldo por categoria com paginação.
    /// O total geral é calculado sobre todas as categorias, independente da página.
    /// </summary>
    public record GetTotaisPorCategoriaQuery(int Page = 1, int PageSize = 10)
        : IRequest<TotaisCategoriasResultDto>;
}