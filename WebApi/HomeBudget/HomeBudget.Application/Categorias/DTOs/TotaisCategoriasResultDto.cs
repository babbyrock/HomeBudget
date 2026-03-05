using HomeBudget.Application.Common;

namespace HomeBudget.Application.Categorias.DTOs
{
    public class TotaisCategoriasResultDto
    {
        public PagedResult<TotalCategoriaDto> Categorias { get; set; }
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquido { get; set; }
    }
}