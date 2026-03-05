using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using MediatR;

namespace HomeBudget.Application.Pessoas.DeletePessoa
{
    /// <summary>
    /// Deleta uma pessoa e todas as suas transações.
    /// A remoção em cascata das transações é garantida pela configuração do EF Core.
    /// Lança KeyNotFoundException se a pessoa não for encontrada.
    /// </summary>
    public class DeletePessoaHandler(IRepositoryBase<Pessoa> repository)
        : IRequestHandler<DeletePessoaCommand>
    {
        public async Task Handle(DeletePessoaCommand request, CancellationToken ct)
        {
            var pessoa = await repository.FindById(request.Id, ct)
                ?? throw new KeyNotFoundException($"Pessoa com ID {request.Id} não encontrada.");

            repository.Remove(pessoa);
            await repository.SaveChangesAsync(ct);
        }
    }
}