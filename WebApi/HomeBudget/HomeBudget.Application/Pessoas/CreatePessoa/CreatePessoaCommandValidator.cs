using FluentValidation;

namespace HomeBudget.Application.Pessoas.CreatePessoa
{
    public class CreatePessoaCommandValidator : AbstractValidator<CreatePessoaCommand>
    {
        public CreatePessoaCommandValidator()
        {
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório.")
                .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres.");

            RuleFor(x => x.Idade)
                .GreaterThan(0).WithMessage("Idade deve ser maior que zero.");
        }
    }
}