import { Injectable } from '@angular/core';
import { AmxServiceBase } from '../../../shared/services/amx-service-base';
import * as environment from '../../../../environments/environment.json';
import { SongSearchForm } from '../models/song-search-form';
import { PaginatedListPage } from '../../../shared/models/paginated-list-page';
import { SearchResultSong } from '../models/search-result-song';

@Injectable({
  providedIn: 'root'
})
export class SongService extends AmxServiceBase {
  protected override apiUrl = `${environment.apiUrl}/songs`;

  /**
   * Search for songs on the YouTube API.
   * @param searchForm Song search criteria.
   * @param pageToken Returned items page token.
   * @returns Songs corresponding to the search.
   */
  public searchSongsAsync(searchForm: SongSearchForm, pageToken = '') {
    return this.tryPostAsync<SongSearchForm, PaginatedListPage<SearchResultSong>>(
      `${this.apiUrl}/search/${pageToken}`,
      searchForm
    );
  }
}
