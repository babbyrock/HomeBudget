namespace HomeBudget.Application.Categorias.DTOs
{
    public class TotalCategoriaDto
    {
        public long Id { get; set; }
        public string Descricao { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}