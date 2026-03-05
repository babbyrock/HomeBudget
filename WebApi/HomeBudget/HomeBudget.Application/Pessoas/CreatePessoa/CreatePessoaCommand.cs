using HomeBudget.Application.Pessoas.DTOs;
using MediatR;

namespace HomeBudget.Application.Pessoas.CreatePessoa
{
    public record CreatePessoaCommand(string Nome, int Idade) : IRequest<PessoaDto>;
}