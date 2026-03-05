using HomeBudget.Application.Common;

namespace HomeBudget.Application.Pessoas.DTOs
{
    public class TotaisPessoasResultDto
    {
        public PagedResult<TotalPessoaDto> Pessoas { get; set; }
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
    }
}