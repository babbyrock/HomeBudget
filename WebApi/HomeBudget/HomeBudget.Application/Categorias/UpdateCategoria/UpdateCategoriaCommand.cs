using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Domain.Enums;
using MediatR;

namespace HomeBudget.Application.Categorias.UpdateCategoria
{
    /// <summary>
    /// Command para atualizar os dados de uma categoria existente.
    /// </summary>
    public record UpdateCategoriaCommand(long Id, string Descricao, Finalidade Finalidade) : IRequest<CategoriaDto?>;
}