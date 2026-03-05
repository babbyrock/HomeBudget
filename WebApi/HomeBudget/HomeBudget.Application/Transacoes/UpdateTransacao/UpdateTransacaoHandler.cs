using HomeBudget.Application.Transacoes.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Enums;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Transacoes.UpdateTransacao
{
    /// <summary>
    /// Atualiza uma transação aplicando as mesmas regras de negócio do Create:
    /// - Menor de idade só pode ter despesas.
    /// - Categoria deve ser compatível com o tipo da transação.
    /// </summary>
    public class UpdateTransacaoHandler(
        IRepositoryBase<Transacao> transacaoRepository,
        IRepositoryBase<Pessoa> pessoaRepository,
        IRepositoryBase<Categoria> categoriaRepository)
        : IRequestHandler<UpdateTransacaoCommand, TransacaoDto?>
    {
        public async Task<TransacaoDto?> Handle(UpdateTransacaoCommand request, CancellationToken ct)
        {
            var transacao = await transacaoRepository.FindById(request.Id, ct)
                ?? throw new KeyNotFoundException($"Transação com ID {request.Id} não encontrada.");

            var pessoa = await pessoaRepository.FindById(request.PessoaId, ct)
                ?? throw new KeyNotFoundException($"Pessoa com ID {request.PessoaId} não encontrada.");

            var categoria = await categoriaRepository.FindById(request.CategoriaId, ct)
                ?? throw new KeyNotFoundException($"Categoria com ID {request.CategoriaId} não encontrada.");

            // Menor de idade só pode ter despesas
            if (pessoa.Idade < 18 && request.Tipo != TipoTransacao.Despesa)
                throw new InvalidOperationException("Menores de idade só podem registrar despesas.");

            // Categoria deve ser compatível com o tipo da transação
            var categoriaIncompativel =
                (request.Tipo == TipoTransacao.Despesa && categoria.Finalidade == Finalidade.Receita) ||
                (request.Tipo == TipoTransacao.Receita && categoria.Finalidade == Finalidade.Despesa);

            if (categoriaIncompativel)
                throw new InvalidOperationException(
                    $"Categoria '{categoria.Descricao}' é incompatível com o tipo '{request.Tipo}'.");

            transacao.Descricao = request.Descricao;
            transacao.Valor = request.Valor;
            transacao.Tipo = request.Tipo;
            transacao.CategoriaId = request.CategoriaId;
            transacao.PessoaId = request.PessoaId;

            transacaoRepository.Update(transacao);
            await transacaoRepository.SaveChangesAsync(ct);

            return transacao.Adapt<TransacaoDto>();
        }
    }
}