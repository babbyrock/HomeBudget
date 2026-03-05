using HomeBudget.Application.Categorias.DTOs;
using MediatR;

namespace HomeBudget.Application.Categorias.GetCategoriaById
{
    /// <summary>
    /// Query para buscar uma categoria pelo identificador único.
    /// </summary>
    public record GetCategoriaByIdQuery(long Id) : IRequest<CategoriaDto?>;
}