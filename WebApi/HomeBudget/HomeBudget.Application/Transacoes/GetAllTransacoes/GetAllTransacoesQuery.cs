using HomeBudget.Application.Common;
using HomeBudget.Application.Transacoes.DTOs;
using MediatR;

namespace HomeBudget.Application.Transacoes.GetAllTransacoes
{
    /// <summary>
    /// Query para listar transações com paginação.
    /// </summary>
    public record GetAllTransacoesQuery(int Page = 1, int PageSize = 10)
        : IRequest<PagedResult<TransacaoDto>>;
}