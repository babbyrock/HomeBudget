using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Categorias.UpdateCategoria
{
    /// <summary>
    /// Atualiza os dados de uma categoria existente.
    /// Lança KeyNotFoundException se a categoria não for encontrada.
    /// </summary>
    public class UpdateCategoriaHandler(IRepositoryBase<Categoria> repository)
        : IRequestHandler<UpdateCategoriaCommand, CategoriaDto?>
    {
        public async Task<CategoriaDto?> Handle(UpdateCategoriaCommand request, CancellationToken ct)
        {
            var categoria = await repository.FindById(request.Id, ct)
                ?? throw new KeyNotFoundException($"Categoria com ID {request.Id} não encontrada.");

            categoria.Descricao = request.Descricao;
            categoria.Finalidade = request.Finalidade;

            repository.Update(categoria);
            await repository.SaveChangesAsync(ct);

            return categoria.Adapt<CategoriaDto>();
        }
    }
}