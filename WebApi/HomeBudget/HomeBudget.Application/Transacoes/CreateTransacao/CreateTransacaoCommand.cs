using HomeBudget.Application.Transacoes.DTOs;
using HomeBudget.Domain.Enums;
using MediatR;

namespace HomeBudget.Application.Transacoes.CreateTransacao
{
    public record CreateTransacaoCommand(
        string Descricao,
        decimal Valor,
        TipoTransacao Tipo,
        long CategoriaId,
        long PessoaId) : IRequest<TransacaoDto>;
}