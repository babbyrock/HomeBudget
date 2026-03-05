using HomeBudget.Application.Transacoes.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Transacoes.GetTransacaoById
{
    /// <summary>
    /// Busca uma transação pelo seu identificador.
    /// Retorna null se não encontrada, e o controller trata o 404.
    /// </summary>
    public class GetTransacaoByIdHandler(IRepositoryBase<Transacao> repository)
        : IRequestHandler<GetTransacaoByIdQuery, TransacaoDto?>
    {
        public async Task<TransacaoDto?> Handle(GetTransacaoByIdQuery request, CancellationToken ct)
        {
            var transacao = await repository.FindById(request.Id, ct);
            return transacao?.Adapt<TransacaoDto>();
        }
    }
}