using HomeBudget.Application.Common;
using HomeBudget.Application.Pessoas.DTOs;
using MediatR;

namespace HomeBudget.Application.Pessoas.GetAllPessoas
{
    /// <summary>
    /// Query para listar pessoas com paginação.
    /// </summary>
    public record GetAllPessoasQuery(int Page = 1, int PageSize = 10)
        : IRequest<PagedResult<PessoaDto>>;
}