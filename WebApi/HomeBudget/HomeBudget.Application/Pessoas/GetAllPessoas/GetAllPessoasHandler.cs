using HomeBudget.Application.Common;
using HomeBudget.Application.Pessoas.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Pessoas.GetAllPessoas
{
    /// <summary>
    /// Retorna lista paginada de pessoas, com paginação feita no banco.
    /// </summary>
    public class GetAllPessoasHandler(IRepositoryBase<Pessoa> repository)
        : IRequestHandler<GetAllPessoasQuery, PagedResult<PessoaDto>>
    {
        public async Task<PagedResult<PessoaDto>> Handle(
            GetAllPessoasQuery request, CancellationToken ct)
        {
            var (items, total) = await repository.FindAllPaged(request.Page, request.PageSize, ct);
            return new PagedResult<PessoaDto>(items.Adapt<IEnumerable<PessoaDto>>(), total, request.Page, request.PageSize);
        }
    }
}