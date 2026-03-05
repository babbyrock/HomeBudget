using HomeBudget.Application.Common;
using HomeBudget.Application.Transacoes.CreateTransacao;
using HomeBudget.Application.Transacoes.DTOs;
using HomeBudget.Application.Transacoes.GetAllTransacoes;
using HomeBudget.Application.Transacoes.GetTransacaoById;
using HomeBudget.Application.Transacoes.UpdateTransacao;
using MediatR;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;

namespace HomeBudget.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TransacoesController(IMediator mediator) => _mediator = mediator;

        [HttpPost]
        public async Task<ActionResult<TransacaoDto>> Create(
            [FromBody] CreateTransacaoCommand command,
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

        /// <summary>Lista transações com paginação.</summary>
        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<TransacaoDto>), 200)]
        public async Task<ActionResult<PagedResult<TransacaoDto>>> GetAll(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
        {
            var result = await _mediator.Send(new GetAllTransacoesQuery(page, pageSize), ct);
            return Ok(result);
        }

        /// <summary>Busca transação por ID.</summary>
        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(TransacaoDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<TransacaoDto>> GetById(long id, CancellationToken ct)
        {
            var result = await _mediator.Send(new GetTransacaoByIdQuery(id), ct);
            return result is null ? NotFound(new { erro = "Transação não encontrada." }) : Ok(result);
        }

        /// <summary>Atualiza os dados de uma transação.</summary>
        [HttpPut("{id:long}")]
        [ProducesResponseType(typeof(TransacaoDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(422)]
        public async Task<ActionResult<TransacaoDto>> Update(long id, [FromBody] UpdateTransacaoCommand command, CancellationToken ct)
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
            catch (InvalidOperationException ex)
            {
                return UnprocessableEntity(new { erro = ex.Message });
            }
        }
    }
}