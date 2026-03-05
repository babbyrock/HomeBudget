using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Categorias.GetCategoriaById
{
    /// <summary>
    /// Busca uma categoria pelo seu identificador.
    /// Retorna null se não encontrada, e o controller trata o 404.
    /// </summary>
    public class GetCategoriaByIdHandler(IRepositoryBase<Categoria> repository)
        : IRequestHandler<GetCategoriaByIdQuery, CategoriaDto?>
    {
        public async Task<CategoriaDto?> Handle(GetCategoriaByIdQuery request, CancellationToken ct)
        {
            var categoria = await repository.FindById(request.Id, ct);
            return categoria?.Adapt<CategoriaDto>();
        }
    }
}