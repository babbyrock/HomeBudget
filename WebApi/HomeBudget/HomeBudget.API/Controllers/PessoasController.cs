using HomeBudget.Application.Common;
using HomeBudget.Application.Pessoas.CreatePessoa;
using HomeBudget.Application.Pessoas.DeletePessoa;
using HomeBudget.Application.Pessoas.DTOs;
using HomeBudget.Application.Pessoas.GetAllPessoas;
using HomeBudget.Application.Pessoas.GetPessoaById;
using HomeBudget.Application.Pessoas.GetTotaisPorPessoa;
using HomeBudget.Application.Pessoas.UpdatePessoa;
using MediatR;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;

namespace HomeBudget.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PessoasController(IMediator mediator) => _mediator = mediator;

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreatePessoaCommand command,
            CancellationToken ct)
        {
            try
            {
                var result = await _mediator.Send(command, ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { erro = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return UnprocessableEntity(new { erro = ex.Message });
            }
        }

        /// <summary>Lista pessoas com paginação.</summary>
        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<PessoaDto>), 200)]
        public async Task<ActionResult<PagedResult<PessoaDto>>> GetAll(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
        {
            var result = await _mediator.Send(new GetAllPessoasQuery(page, pageSize), ct);
            return Ok(result);
        }

        /// <summary>Busca pessoa por ID.</summary>
        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(PessoaDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<PessoaDto>> GetById(long id, CancellationToken ct)
        {
            var result = await _mediator.Send(new GetPessoaByIdQuery(id), ct);
            return result is null ? NotFound(new { erro = "Pessoa não encontrada." }) : Ok(result);
        }

        /// <summary>Atualiza os dados de uma pessoa.</summary>
        [HttpPut("{id:long}")]
        [ProducesResponseType(typeof(PessoaDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<PessoaDto>> Update(long id, [FromBody] UpdatePessoaCommand command, CancellationToken ct)
        {
            try
            {
                var result = await _mediator.Send(command with { Id = id }, ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { erro = ex.Message });
            }
        }

        /// <summary>
        /// Deleta uma pessoa e todas as suas transações associadas.
        /// </summary>
        [HttpDelete("{id:long}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(long id, CancellationToken ct)
        {
            try
            {
                await _mediator.Send(new DeletePessoaCommand(id), ct);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { erro = ex.Message });
            }
        }

        /// <summary>
        /// Lista totais de receitas, despesas e saldo por pessoa com paginação.
        /// O total geral ao final reflete todas as pessoas cadastradas.
        /// </summary>
        [HttpGet("totais")]
        [ProducesResponseType(typeof(TotaisPessoasResultDto), 200)]
        public async Task<ActionResult<TotaisPessoasResultDto>> GetTotais(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
        {
            var result = await _mediator.Send(new GetTotaisPorPessoaQuery(page, pageSize), ct);
            return Ok(result);
        }
    }
}