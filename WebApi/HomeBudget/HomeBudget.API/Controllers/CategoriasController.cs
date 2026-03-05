using HomeBudget.Application.Categorias.CreateCategoria;
using HomeBudget.Application.Categorias.DTOs;
using HomeBudget.Application.Categorias.GetAllCategorias;
using HomeBudget.Application.Categorias.GetCategoriaById;
using HomeBudget.Application.Categorias.GetTotaisPorCategoria;
using HomeBudget.Application.Categorias.UpdateCategoria;
using HomeBudget.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;

namespace HomeBudget.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CategoriasController(IMediator mediator) => _mediator = mediator;

        [HttpPost]
        public async Task<ActionResult<CategoriaDto>> Create(
            [FromBody] CreateCategoriaCommand command,
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

        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<CategoriaDto>), 200)]
        public async Task<ActionResult<PagedResult<CategoriaDto>>> GetAll(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
        {
            var result = await _mediator.Send(new GetAllCategoriasQuery(page, pageSize), ct);
            return Ok(result);
        }

        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(CategoriaDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<CategoriaDto>> GetById(long id, CancellationToken ct)
        {
            var result = await _mediator.Send(new GetCategoriaByIdQuery(id), ct);
            return result is null ? NotFound(new { erro = "Categoria não encontrada." }) : Ok(result);
        }

        /// <summary>Atualiza os dados de uma categoria.</summary>
        [HttpPut("{id:long}")]
        [ProducesResponseType(typeof(CategoriaDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<CategoriaDto>> Update(long id, [FromBody] UpdateCategoriaCommand command, CancellationToken ct)
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
        /// Lista totais de receitas, despesas e saldo por categoria com paginação.
        /// O total geral ao final reflete todas as categorias cadastradas.
        /// </summary>
        [HttpGet("totais")]
        [ProducesResponseType(typeof(TotaisCategoriasResultDto), 200)]
        public async Task<ActionResult<TotaisCategoriasResultDto>> GetTotais(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
        {
            var result = await _mediator.Send(new GetTotaisPorCategoriaQuery(page, pageSize), ct);
            return Ok(result);
        }
    }
}