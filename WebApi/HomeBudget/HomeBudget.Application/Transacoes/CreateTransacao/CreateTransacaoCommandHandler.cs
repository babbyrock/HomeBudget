using HomeBudget.Application.Pessoas.DTOs;
using HomeBudget.Application.Transacoes.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Enums;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Transacoes.CreateTransacao
{
    public class CreateTransacaoCommandHandler : IRequestHandler<CreateTransacaoCommand, TransacaoDto>
    {
        private readonly IRepositoryBase<Pessoa> _pessoaRepository;
        private readonly IRepositoryBase<Categoria> _categoriaRepository;
        private readonly IRepositoryBase<Transacao> _transacaoRepository;

        public CreateTransacaoCommandHandler(
            IRepositoryBase<Transacao> transacaoRepository,
            IRepositoryBase<Pessoa> pessoaRepository,
            IRepositoryBase<Categoria> categoriaRepository)
        {
            _transacaoRepository = transacaoRepository;
            _pessoaRepository = pessoaRepository;
            _categoriaRepository = categoriaRepository;
        }

        public async Task<TransacaoDto> Handle(CreateTransacaoCommand request, CancellationToken ct)
        {
            // 1. Valida se a pessoa existe
            var pessoa = await _pessoaRepository.FindById(request.PessoaId, ct)
                ?? throw new KeyNotFoundException("Pessoa não encontrada.");

            // 2. Regra: menor de idade só pode registrar despesa
            if (pessoa.MenorDeIdade() && request.Tipo == TipoTransacao.Receita)
                throw new InvalidOperationException("Menores de idade só podem registrar despesas.");

            // 3. Valida se a categoria existe
            var categoria = await _categoriaRepository.FindById(request.CategoriaId, ct)
                ?? throw new KeyNotFoundException("Categoria não encontrada.");

            // 4. Regra: categoria deve permitir o tipo da transação
            if (!categoria.PermiteTransacao(request.Tipo))
                throw new InvalidOperationException(
                    $"A categoria '{categoria.Descricao}' não permite transações do tipo '{request.Tipo}'.");

            var transacao = request.Adapt<Transacao>();

            await _transacaoRepository.AddAsync(transacao!, ct);
            await _transacaoRepository.SaveChangesAsync(ct);

            return transacao.Adapt<TransacaoDto>();
        }
    }
}