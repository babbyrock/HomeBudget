using HomeBudget.Application.Pessoas.DTOs;
using MediatR;

namespace HomeBudget.Application.Pessoas.UpdatePessoa
{
    /// <summary>
    /// Command para atualizar os dados de uma pessoa existente.
    /// </summary>
    public record UpdatePessoaCommand(long Id, string Nome, int Idade) : IRequest<PessoaDto?>;
}