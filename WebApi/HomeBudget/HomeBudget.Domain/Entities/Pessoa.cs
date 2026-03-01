using RestWithASPNET10.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeBudget.Domain.Entities
{
    public class Pessoa : BaseEntity
    {
        [Required]
        [Column("nome", TypeName = "varchar")]
        public string Nome { get; set; }
        [Required]
        [Column("idade", TypeName = "int")]
        public int Idade { get; set; }

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

    }
}
