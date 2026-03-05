using MediatR;

namespace HomeBudget.Application.Pessoas.DeletePessoa
{
    /// <summary>
    /// Command para deletar uma pessoa e todas as suas transações.
    /// </summary>
    public record DeletePessoaCommand(long Id) : IRequest;
}