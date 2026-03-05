using HomeBudget.Application.Transacoes.DTOs;
using MediatR;

namespace HomeBudget.Application.Transacoes.GetTransacaoById
{
    /// <summary>
    /// Query para buscar uma transação pelo identificador único.
    /// </summary>
    public record GetTransacaoByIdQuery(long Id) : IRequest<TransacaoDto?>;
}