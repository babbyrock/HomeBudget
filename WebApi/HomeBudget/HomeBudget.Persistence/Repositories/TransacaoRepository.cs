using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using HomeBudget.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace HomeBudget.Persistence.Repositories
{
    /// <summary>
    /// Repositório de Transacao.
    /// Carrega transações com navegação para Pessoa ou Categoria
    /// para permitir agrupamento na camada Application.
    /// </summary>
    public class TransacaoRepository(AppDbContext context)
        : RepositoryBase<Transacao>(context), ITransacaoRepository
    {
        public async Task<IEnumerable<Transacao>> GetTransacoesComPessoa(CancellationToken ct = default)
            => await _context.Transacoes
                .AsNoTracking()
                .Include(t => t.Pessoa)
                .ToListAsync(ct);

        public async Task<IEnumerable<Transacao>> GetTransacoesComCategoria(CancellationToken ct = default)
            => await _context.Transacoes
                .AsNoTracking()
                .Include(t => t.Categoria)
                .ToListAsync(ct);

        public async Task<(IEnumerable<Transacao> Items, int Total)> FindAllPagedComDetalhes(
            int page, int pageSize, CancellationToken ct = default)
                {
                    var query = _context.Transacoes
                        .AsNoTracking()
                        .Include(t => t.Pessoa)
                        .Include(t => t.Categoria);

                    var total = await query.CountAsync(ct);
                    var items = await query
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync(ct);

                    return (items, total);
                }
    }
}