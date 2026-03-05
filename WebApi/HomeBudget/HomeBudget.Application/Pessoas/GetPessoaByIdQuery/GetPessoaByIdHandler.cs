using HomeBudget.Application.Pessoas.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Pessoas.GetPessoaById
{
    /// <summary>
    /// Busca uma pessoa pelo seu identificador.
    /// Retorna null se não encontrada, e o controller trata o 404.
    /// </summary>
    public class GetPessoaByIdHandler(IRepositoryBase<Pessoa> repository)
        : IRequestHandler<GetPessoaByIdQuery, PessoaDto?>
    {
        public async Task<PessoaDto?> Handle(GetPessoaByIdQuery request, CancellationToken ct)
        {
            var pessoa = await repository.FindById(request.Id, ct);
            return pessoa?.Adapt<PessoaDto>();
        }
    }
}