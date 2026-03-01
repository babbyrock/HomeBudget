using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeBudget.Domain.Entities
{
    public class Categoria
    {
        [Required]
        [Column("descricao", TypeName = "varchar(400)")]
        public string Descricao { get; set; }

        [Required]
        [Column("finalidade", TypeName = "varchar(20)")]
        public string Finalidade { get; set; } 

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

    }
}
