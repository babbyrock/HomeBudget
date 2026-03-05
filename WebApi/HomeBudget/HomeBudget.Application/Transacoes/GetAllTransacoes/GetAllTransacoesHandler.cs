using HomeBudget.Application.Common;
using HomeBudget.Application.Transacoes.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Transacoes.GetAllTransacoes
{
    /// <summary>
    /// Retorna lista paginada de transações com dados de pessoa e categoria,
    /// paginação executada diretamente no banco.
    /// </summary>
    public class GetAllTransacoesHandler(ITransacaoRepository repository)
        : IRequestHandler<GetAllTransacoesQuery, PagedResult<TransacaoDto>>
    {
        public async Task<PagedResult<TransacaoDto>> Handle(
            GetAllTransacoesQuery request, CancellationToken ct)
        {
            var (items, total) = await repository.FindAllPagedComDetalhes(request.Page, request.PageSize, ct);
            return new PagedResult<TransacaoDto>(items.Adapt<IEnumerable<TransacaoDto>>(), total, request.Page, request.PageSize);
        }
    }
}