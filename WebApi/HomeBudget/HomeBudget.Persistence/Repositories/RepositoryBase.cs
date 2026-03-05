using HomeBudget.Domain.Entities;
using HomeBudget.Domain.Interfaces;
using HomeBudget.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using RestWithASPNET10.Model.Base;
using System.Linq.Expressions;

namespace HomeBudget.Persistence.Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : BaseEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public RepositoryBase(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T?> FindById(long id, CancellationToken ct = default)
            => await _dbSet.FindAsync(id, ct);

        public async Task<IEnumerable<T>> FindAll(CancellationToken ct = default)
            => await _dbSet.AsNoTracking().ToListAsync(ct);

        public async Task<(IEnumerable<T> Items, int Total)> FindAllPaged(
            int page, int pageSize, CancellationToken ct = default)
        {
            var query = _dbSet.AsNoTracking();
            var total = await query.CountAsync(ct);
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

            return (items, total);
        }

        public async Task AddAsync(T entity, CancellationToken ct = default)
            => await _dbSet.AddAsync(entity, ct);

        public void Update(T entity)
            => _dbSet.Update(entity);

        public void Remove(T entity)
            => _dbSet.Remove(entity);

        public async Task SaveChangesAsync(CancellationToken ct = default)
            => await _context.SaveChangesAsync(ct);
    }
}