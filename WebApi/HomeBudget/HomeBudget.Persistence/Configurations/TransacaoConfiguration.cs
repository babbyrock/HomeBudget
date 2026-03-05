using HomeBudget.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HomeBudget.Persistence.Configurations
{
    public class TransacaoConfiguration : IEntityTypeConfiguration<Transacao>
    {
        public void Configure(EntityTypeBuilder<Transacao> builder)
        {
            builder.ToTable("Transacao");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(t => t.Descricao)
                   .HasColumnType("NVARCHAR(400)")
                   .IsRequired();

            builder.Property(t => t.Valor)
                   .HasColumnType("DECIMAL(18,2)")
                   .IsRequired();

            builder.Property(t => t.Tipo)
                   .HasConversion<string>()
                   .HasColumnType("VARCHAR(20)")
                   .IsRequired();

            builder.HasOne(t => t.Pessoa)
                   .WithMany(p => p.Transacoes)
                   .HasForeignKey(t => t.PessoaId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(t => t.Categoria)
                   .WithMany(c => c.Transacoes)
                   .HasForeignKey(t => t.CategoriaId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }

}
