export class PaginatedListPage<T> {
  public pageToken? = '';
  public previousPageToken? = '';
  public nextPageToken? = '';
  public items = new Array<T>();
  public totalItemCount = 0;
}
