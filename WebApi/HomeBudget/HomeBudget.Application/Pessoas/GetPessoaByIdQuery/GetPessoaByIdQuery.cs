using HomeBudget.Application.Pessoas.DTOs;
using MediatR;

namespace HomeBudget.Application.Pessoas.GetPessoaById
{
    /// <summary>
    /// Query para buscar uma pessoa pelo identificador único.
    /// </summary>
    public record GetPessoaByIdQuery(long Id) : IRequest<PessoaDto?>;
}