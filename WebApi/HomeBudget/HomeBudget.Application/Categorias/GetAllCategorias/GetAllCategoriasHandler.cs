using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Application.Common;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Categorias.GetAllCategorias
{
    public class GetAllCategoriasHandler(IRepositoryBase<Categoria> repository)
        : IRequestHandler<GetAllCategoriasQuery, PagedResult<CategoriaDto>>
    {
        public async Task<PagedResult<CategoriaDto>> Handle(
            GetAllCategoriasQuery request, CancellationToken ct)
        {
            var (items, total) = await repository.FindAllPaged(request.Page, request.PageSize, ct);
            return new PagedResult<CategoriaDto>(items.Adapt<IEnumerable<CategoriaDto>>(), total, request.Page, request.PageSize);
        }
    }
}