using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Application.Pessoas.DTOs;
using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using Mapster;
using MediatR;

namespace HomeBudget.Application.Categorias.CreateCategoria
{
    public class CreateCategoriaCommandHandler : IRequestHandler<CreateCategoriaCommand, CategoriaDto>
    {
        private readonly IRepositoryBase<Categoria> _categoriaRepository;

        public CreateCategoriaCommandHandler(IRepositoryBase<Categoria> repository)
            => _categoriaRepository = repository;

        public async Task<CategoriaDto> Handle(CreateCategoriaCommand request, CancellationToken ct)
        {
            var categoria = new Categoria
            {
                Descricao = request.Descricao,
                Finalidade = request.Finalidade
            };

            await _categoriaRepository.AddAsync(categoria, ct);
            await _categoriaRepository.SaveChangesAsync(ct);

            return categoria.Adapt<CategoriaDto>(); ;
        }
    }
}