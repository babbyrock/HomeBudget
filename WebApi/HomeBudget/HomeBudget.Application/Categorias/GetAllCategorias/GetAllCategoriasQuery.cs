using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Application.Common;
using MediatR;

namespace HomeBudget.Application.Categorias.GetAllCategorias
{
    /// <summary>
    /// Query para listar categorias com paginação.
    /// </summary>
    public record GetAllCategoriasQuery(int Page = 1, int PageSize = 10)
        : IRequest<PagedResult<CategoriaDto>>;
}