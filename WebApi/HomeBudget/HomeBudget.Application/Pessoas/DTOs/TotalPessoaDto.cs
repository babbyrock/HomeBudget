namespace HomeBudget.Application.Pessoas.DTOs
{
    public class TotalPessoaDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}