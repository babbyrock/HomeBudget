using HomeBudget.Domain.Enums;
using RestWithASPNET10.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeBudget.Domain.Entities
{
    public class Categoria : BaseEntity
    {
        public string Descricao { get; set; }
        public Finalidade Finalidade { get; set; }

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
        public bool PermiteTransacao(TipoTransacao tipo)
        {
            if (Finalidade == Finalidade.Ambas) return true;

            return Finalidade.ToString() == tipo.ToString();
        }
    }
}
