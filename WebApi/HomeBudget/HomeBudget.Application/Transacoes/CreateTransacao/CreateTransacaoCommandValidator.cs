using FluentValidation;

namespace HomeBudget.Application.Transacoes.CreateTransacao
{
    public class CreateTransacaoCommandValidator : AbstractValidator<CreateTransacaoCommand>
    {
        public CreateTransacaoCommandValidator()
        {
            RuleFor(x => x.Descricao)
                .NotEmpty().WithMessage("Descrição é obrigatória.")
                .MaximumLength(400).WithMessage("Descrição deve ter no máximo 400 caracteres.");

            RuleFor(x => x.Valor)
                .GreaterThan(0).WithMessage("Valor deve ser positivo.");

            RuleFor(x => x.Tipo)
                .IsInEnum().WithMessage("Tipo inválido. Use: Despesa ou Receita.");

            RuleFor(x => x.CategoriaId)
                .GreaterThan(0).WithMessage("Categoria é obrigatória.");

            RuleFor(x => x.PessoaId)
                .GreaterThan(0).WithMessage("Pessoa é obrigatória.");
        }
    }
}