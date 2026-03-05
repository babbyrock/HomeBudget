// HomeBudget.Application/Pessoas/GetTotaisPorPessoa/GetTotaisPorPessoaQuery.cs
using HomeBudget.Application.Pessoas.DTOs;
using MediatR;

namespace HomeBudget.Application.Pessoas.GetTotaisPorPessoa
{
    /// <summary>
    /// Query para obter totais de receitas, despesas e saldo por pessoa com paginação.
    /// O total geral é calculado sobre todas as pessoas, independente da página.
    /// </summary>
    public record GetTotaisPorPessoaQuery(int Page = 1, int PageSize = 10)
        : IRequest<TotaisPessoasResultDto>;
}