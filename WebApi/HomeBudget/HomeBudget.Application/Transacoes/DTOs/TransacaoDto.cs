namespace HomeBudget.Application.Transacoes.DTOs
{
    public class TransacaoDto
    {
        public long Id { get; set; }
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public string Tipo { get; set; }
        public string NomePessoa { get; set; }
        public string NomeCategoria { get; set; }
    }
}