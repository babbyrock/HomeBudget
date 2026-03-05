using HomeBudget.Domain.Entities;

namespace HomeBudget.Domain.Interfaces
{
    /// <summary>
    /// Repositório específico de Transacao com queries de agregação.
    /// </summary>
    public interface ITransacaoRepository : IRepositoryBase<Transacao>
    {
        Task<IEnumerable<Transacao>> GetTransacoesComPessoa(CancellationToken ct = default);
        Task<IEnumerable<Transacao>> GetTransacoesComCategoria(CancellationToken ct = default);
        Task<(IEnumerable<Transacao> Items, int Total)> FindAllPagedComDetalhes(int page, int pageSize, CancellationToken ct = default);
    }
}