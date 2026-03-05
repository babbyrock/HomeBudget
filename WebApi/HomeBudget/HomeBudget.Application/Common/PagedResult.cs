namespace HomeBudget.Application.Common
{
    /// <summary>
    /// Wrapper genérico para respostas paginadas.
    /// Fornece metadados de navegação para o front-end.
    /// </summary>
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; }
        public int TotalItems { get; }
        public int Page { get; }
        public int PageSize { get; }
        public int TotalPages { get; }
        public bool HasNext => Page < TotalPages;
        public bool HasPrevious => Page > 1;

        public PagedResult(IEnumerable<T> items, int totalItems, int page, int pageSize)
        {
            Items = items;
            TotalItems = totalItems;
            Page = page;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
        }
    }
}