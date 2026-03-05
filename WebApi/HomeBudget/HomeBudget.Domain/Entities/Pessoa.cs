using RestWithASPNET10.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeBudget.Domain.Entities
{
    public class Pessoa : BaseEntity
    {
        public string Nome { get; set; }
        public int Idade { get; set; }

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

        public bool MenorDeIdade() => Idade < 18;

    }
}
