using HomeBudget.Application.Pessoas.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Pessoas.UpdatePessoa
{
    /// <summary>
    /// Atualiza os dados de uma pessoa existente.
    /// Lança KeyNotFoundException se a pessoa não for encontrada.
    /// </summary>
    public class UpdatePessoaHandler(IRepositoryBase<Pessoa> repository)
        : IRequestHandler<UpdatePessoaCommand, PessoaDto?>
    {
        public async Task<PessoaDto?> Handle(UpdatePessoaCommand request, CancellationToken ct)
        {
            var pessoa = await repository.FindById(request.Id, ct)
                ?? throw new KeyNotFoundException($"Pessoa com ID {request.Id} não encontrada.");

            pessoa.Nome = request.Nome;
            pessoa.Idade = request.Idade;

            repository.Update(pessoa);
            await repository.SaveChangesAsync(ct);

            return pessoa.Adapt<PessoaDto>();
        }
    }
}