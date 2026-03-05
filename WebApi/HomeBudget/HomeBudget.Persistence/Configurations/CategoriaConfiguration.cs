using HomeBudget.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HomeBudget.Persistence.Configurations
{
    public class CategoriaConfiguration : IEntityTypeConfiguration<Categoria>
    {
        public void Configure(EntityTypeBuilder<Categoria> builder)
        {
            builder.ToTable("Categoria");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(p => p.Descricao)
                   .HasColumnType("NVARCHAR(400)")
                   .IsRequired();

            builder.Property(c => c.Finalidade)
                   .HasConversion<string>()
                   .HasColumnType("VARCHAR(20)")
                   .IsRequired();
        }
    }
}
