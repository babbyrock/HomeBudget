using RestWithASPNET10.Model.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HomeBudget.Domain.Entities
{
    public class Transacao : BaseEntity
    {
        [Required]
        [Column("descricao", TypeName = "varchar(400)")]
        public string Descricao { get; set; }

        [Required]
        [Column("valor", TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }

        [Required]
        [Column("tipo", TypeName = "varchar(20)")]
        public string Tipo { get; set; } 

        [Required]
        [ForeignKey("Pessoa")]
        public Guid PessoaId { get; set; }
        public Pessoa Pessoa { get; set; }

        [Required]
        [ForeignKey("Categoria")]
        public Guid CategoriaId { get; set; }
        public Categoria Categoria { get; set; }

    }
}
