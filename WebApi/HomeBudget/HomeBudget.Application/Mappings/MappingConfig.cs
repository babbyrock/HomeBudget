using HomeBudget.Application.Categorias.CreateCategoria;
using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Application.Pessoas.CreatePessoa;
using HomeBudget.Application.Pessoas.DTOs;
using HomeBudget.Application.Transacoes.CreateTransacao;
using HomeBudget.Application.Transacoes.DTOs;
using HomeBudget.Domain.Entities;
using Mapster;

namespace HomeBudget.Application.Mappings
{
    public static class MappingConfig
    {
        public static void RegisterMappings()
        {
            // Command → Entidade (POST)
            TypeAdapterConfig<CreatePessoaCommand, Pessoa>.NewConfig();
            TypeAdapterConfig<CreateCategoriaCommand, Categoria>.NewConfig();
            TypeAdapterConfig<CreateTransacaoCommand, Transacao>.NewConfig();

            // Entidade → DTO (GET)
            TypeAdapterConfig<Pessoa, PessoaDto>.NewConfig();

            TypeAdapterConfig<Categoria, CategoriaDto>.NewConfig()
                .Map(dest => dest.Finalidade, src => src.Finalidade.ToString());

            TypeAdapterConfig<Transacao, TransacaoDto>.NewConfig()
                .Map(dest => dest.NomePessoa, src => src.Pessoa.Nome)
                .Map(dest => dest.NomeCategoria, src => src.Categoria.Descricao)
                .Map(dest => dest.Tipo, src => src.Tipo.ToString());
        }
    }
}