using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Domain.Enums;
using MediatR;

namespace HomeBudget.Application.Categorias.CreateCategoria
{
    /// <summary>
    /// Finalidade: 0 = Despesa, 1 = Receita, 2 = Ambas
    /// </summary>
    public record CreateCategoriaCommand(string Descricao, Finalidade Finalidade) : IRequest<CategoriaDto>;
}