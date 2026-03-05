using HomeBudget.Application.Pessoas.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Pessoas.CreatePessoa
{
    public class CreatePessoaCommandHandler : IRequestHandler<CreatePessoaCommand, PessoaDto>
    {
        private readonly IRepositoryBase<Pessoa> _pessoaRepository;

        public CreatePessoaCommandHandler(IRepositoryBase<Pessoa> repository)
            => _pessoaRepository = repository;

        public async Task<PessoaDto> Handle(CreatePessoaCommand request, CancellationToken ct)
        {
            var pessoa = request.Adapt<Pessoa>();

            await _pessoaRepository.AddAsync(pessoa, ct);
            await _pessoaRepository.SaveChangesAsync(ct);

            return pessoa.Adapt<PessoaDto>();
        }
    }
}