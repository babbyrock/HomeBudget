namespace HomeBudget.Domain.Interfaces
{
    public interface IRepositoryBase<T> where T : class
    {
        Task<T?> FindById(long id, CancellationToken ct = default);
        Task<IEnumerable<T>> FindAll(CancellationToken ct = default);
        Task<(IEnumerable<T> Items, int Total)> FindAllPaged(int page, int pageSize, CancellationToken ct = default);
        Task AddAsync(T entity, CancellationToken ct = default);
        void Update(T entity);
        void Remove(T entity);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}