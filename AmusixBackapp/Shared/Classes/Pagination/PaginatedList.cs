namespace AmusixBackapp.Shared.Classes.Pagination;

/// <summary>
/// Class to apply pagination to a list of items.
/// </summary>
/// <typeparam name="T"></typeparam>
public class PaginatedList<T>
{
    private readonly List<T> _items;

    /// <summary>
    /// Total number of items across all pages.
    /// </summary>
    public int TotalItemCount => _items.Count;

    /// <summary>
    /// Initialize a paginated list.
    /// </summary>
    /// <param name="items">Ordered items to apply pagination to.</param>
    public PaginatedList(List<T> items)
    {
        _items = items;
    }

    /// <summary>
    /// Get the items corresponding to a page.
    /// </summary>
    /// <param name="token">Token of the page to get the corresponding items from.</param>
    /// <returns>Corresponding page.</returns>
    /// <exception cref="FormatException">If invalid page token.</exception>
    public PaginatedListPage<T> Page(string? token = null)
    {
        token ??= "1";
        if (int.TryParse(token, out var pageNumber))
        {
            return new PaginatedListPage<T>(
                _items.Skip((pageNumber - 1) * AppConstants.DataPageSize).Take(AppConstants.DataPageSize).ToList(),
                TotalItemCount,
                token,
                pageNumber > 1 ? $"{pageNumber - 1}" : null,
                Math.Min(pageNumber + 1, TotalItemCount).ToString());
        }
        throw new FormatException("Invalid page token");
    }
}