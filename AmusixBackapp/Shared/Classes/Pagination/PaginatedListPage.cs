namespace AmusixBackapp.Shared.Classes.Pagination;

/// <summary>
/// Paginated list page of items.
/// </summary>
public class PaginatedListPage<T>
{
    /// <summary>
    /// Page token.
    /// </summary>
    public string? PageToken { get; }
    
    /// <summary>
    /// Previous page token.
    /// </summary>
    public string? PreviousPageToken { get; }
    
    /// <summary>
    /// Next page token.
    /// </summary>
    /// <returns></returns>
    public string? NextPageToken { get; }
    
    /// <summary>
    /// Page items.
    /// </summary>
    public List<T> Items { get; }
    
    /// <summary>
    /// Total number of items across all pages.
    /// </summary>
    public int TotalItemCount { get; }

    /// <summary>
    /// Initialize a paginated list page.
    /// </summary>
    /// <param name="items">Page items.</param>
    /// <param name="totalItemCount">Total number of items across all pages.</param>
    /// /// <param name="pageToken">Page number.</param>
    /// <param name="previousPageToken">Previous page token.</param>
    /// <param name="nextPageToken">Next page token.</param>
    public PaginatedListPage(
        IEnumerable<T> items, 
        int totalItemCount, 
        string? pageToken = null,
        string? previousPageToken = null,
        string? nextPageToken = null)
    {
        PageToken = pageToken;
        Items = items.ToList();
        TotalItemCount = totalItemCount;
        PreviousPageToken = previousPageToken;
        NextPageToken = nextPageToken;
    }
}