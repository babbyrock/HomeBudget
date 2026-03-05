using HomeBudget.Application.Transacoes.DTOs;
using HomeBudget.Domain.Enums;
using MediatR;

namespace HomeBudget.Application.Transacoes.UpdateTransacao
{
    /// <summary>
    /// Command para atualizar os dados de uma transação existente.
    /// </summary>
    public record UpdateTransacaoCommand(
        long Id,
        string Descricao,
        decimal Valor,
        TipoTransacao Tipo,
        long CategoriaId,
        long PessoaId) : IRequest<TransacaoDto?>;
}