import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { DynamicPaginatedList } from '../../../../shared/components/dynamic-paginated-list/dynamic-paginated-list';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { SongService } from '../../services/song-service';
import { SongSearchForm } from '../../models/song-search-form';
import { SearchResultSongItem } from '../search-result-song-item/search-result-song-item';
import { AddPlaylistSongModal } from '../../../playlists/components/add-playlist-song-modal/add-playlist-song-modal';
import { SearchResultSong } from '../../models/search-result-song';
import { SongStatus } from '../../../../shared/enums/song-status';

@Component({
  selector: 'app-song-search-results',
  imports: [
    DynamicPaginatedList,
    RouterLink,
    SearchResultSongItem,
    AddPlaylistSongModal
  ],
  templateUrl: './song-search-results.html',
  styleUrl: './song-search-results.scss'
})
export class SongSearchResults extends AmxComponentBase implements OnInit {
  //region fields

  protected songSearchForm = signal(new SongSearchForm());
  protected playlistAddModal = viewChild<AddPlaylistSongModal>('playlistAddModal');

  //endregion

  //region injections

  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly songService = inject(SongService);

  //endregion

  //region methods

  ngOnInit() {
    this.songSearchForm.set({searchText: this.activatedRoute.snapshot.params['searchText']});
  }

  protected async addSongToPlaylist(song: SearchResultSong) {
    await this.playlistAddModal()?.openAsync({
      ytbId: song.ytbId,
      artistName: song.artistName,
      duration: song.duration,
      name: song.name,
      publishedAt: song.publishedAt,
      thumbnailUrl: song.thumbnailUrl,
      status: SongStatus.VALID
    });
  }

  //endregion
}
