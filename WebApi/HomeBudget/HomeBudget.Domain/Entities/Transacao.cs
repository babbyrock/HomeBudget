using HomeBudget.Domain.Enums;
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
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public long PessoaId { get; set; }
        public long CategoriaId { get; set; }

        public Pessoa Pessoa { get; set; }
        public Categoria Categoria { get; set; }

    }
}
