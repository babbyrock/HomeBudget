using FluentValidation;

namespace HomeBudget.Application.Categorias.CreateCategoria
{
    public class CreateCategoriaCommandValidator : AbstractValidator<CreateCategoriaCommand>
    {
        public CreateCategoriaCommandValidator()
        {
            RuleFor(x => x.Descricao)
                .NotEmpty().WithMessage("Descrição é obrigatória.")
                .MaximumLength(400).WithMessage("Descrição deve ter no máximo 400 caracteres.");

            RuleFor(x => x.Finalidade)
                .IsInEnum().WithMessage("Finalidade inválida. Use: Despesa, Receita ou Ambas.");
        }
    }
}