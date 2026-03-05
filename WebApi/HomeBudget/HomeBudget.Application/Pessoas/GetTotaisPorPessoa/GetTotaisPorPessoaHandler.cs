using HomeBudget.Application.Common;
using HomeBudget.Application.Pessoas.DTOs;
using HomeBudget.Domain.Enums;
using HomeBudget.Domain.Interfaces;
using MediatR;

namespace HomeBudget.Application.Pessoas.GetTotaisPorPessoa
{
    /// <summary>
    /// Agrupa transações por pessoa, calcula totais e pagina o resultado.
    /// O total geral é calculado antes da paginação para refletir todas as pessoas.
    /// </summary>
    public class GetTotaisPorPessoaHandler(ITransacaoRepository repository)
        : IRequestHandler<GetTotaisPorPessoaQuery, TotaisPessoasResultDto>
    {
        public async Task<TotaisPessoasResultDto> Handle(
            GetTotaisPorPessoaQuery request, CancellationToken ct)
        {
            var transacoes = await repository.GetTransacoesComPessoa(ct);

            var todosOsTotais = transacoes
                .GroupBy(t => t.PessoaId)
                .Select(g => new TotalPessoaDto
                {
                    Id = g.First().Pessoa.Id,
                    Nome = g.First().Pessoa.Nome,
                    TotalReceitas = g.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                    TotalDespesas = g.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                    Saldo = g.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor)
                           - g.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
                }).ToList();
            var totalGeralReceitas = todosOsTotais.Sum(p => p.TotalReceitas);
            var totalGeralDespesas = todosOsTotais.Sum(p => p.TotalDespesas);

            var itensPaginados = todosOsTotais
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            return new TotaisPessoasResultDto
            {
                Pessoas = new PagedResult<TotalPessoaDto>(itensPaginados, todosOsTotais.Count, request.Page, request.PageSize),
                TotalGeralReceitas = totalGeralReceitas,
                TotalGeralDespesas = totalGeralDespesas,
                SaldoLiquido = totalGeralReceitas - totalGeralDespesas
            };
        }
    }
}