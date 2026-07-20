import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { Modal } from '../../../../shared/components/modal/modal';
import { Loading } from '../../../../shared/components/loading/loading';
import { PlaylistService } from '../../services/playlist-service';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { AlertType } from '../../../../shared/enums/alert-type';
import { PlaylistInfo } from '../../models/playlist-info';
import { NgTemplateOutlet } from '@angular/common';
import { PlaylistSelectItem } from '../playlist-select-item/playlist-select-item';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PaginatedListPage } from '../../../../shared/models/paginated-list-page';
import { SongInfo } from '../../../songs/models/song-info';

/** Modal to add a song to a playlist. */
@Component({
  selector: 'app-add-playlist-song-modal',
  imports: [
    Modal,
    Loading,
    FormField,
    FormsModule,
    NgTemplateOutlet,
    PlaylistSelectItem
  ],
  templateUrl: './add-playlist-song-modal.html',
  styleUrl: './add-playlist-song-modal.scss'
})
export class AddPlaylistSongModal extends AmxComponentBase {
  //region fields

  // Component

  protected isLoading = signal(false);
  protected modal = viewChild<Modal>('modal');
  protected songToAdd = new SongInfo();

  // Existing playlists

  protected currentPlaylistId?: string;
  protected paginatedPlaylists = signal(new PaginatedListPage<PlaylistInfo>());
  protected filteredPlaylists = computed(() =>
    this.paginatedPlaylists().items.filter(x => x.id != this.currentPlaylistId));
  protected showPlaylistOptions = signal(false);
  protected selectedPlaylist = signal<PlaylistInfo | undefined>(undefined);
  protected areAllPlaylistsLoaded = computed(() =>
    this.paginatedPlaylists().items.length == this.paginatedPlaylists().totalItemCount);

  // New playlist

  protected addedPlaylist = signal({playlistName: ''});
  protected playlistForm = form(this.addedPlaylist, x => {
    required(x.playlistName);
    maxLength(x.playlistName, 100);
  });

  //endregion

  //region injections

  protected readonly playlistService = inject(PlaylistService);

  //endregion

  //region methods

  /**
   * Open the modal.
   * @param song Song to add to a playlist.
   * @param currentPlaylistId ID of the currently opened playlist the song is already in.
   */
  public async openAsync(song: SongInfo, currentPlaylistId?: string) {
    this.isLoading.set(true);
    this.modal()?.open();

    // Reset modal
    this.songToAdd = song;
    this.currentPlaylistId = currentPlaylistId;
    this.selectedPlaylist.set(undefined);
    this.playlistForm().controlValue.set({playlistName: ''});
    this.playlistForm().reset();

    // Get existing playlists
    this.paginatedPlaylists.set((await this.playlistService.getCurrentUserPlaylistsAsync())!);

    this.isLoading.set(false);
  }

  //region existing playlists

  protected async loadMorePlaylists() {
    if (!this.areAllPlaylistsLoaded()) {
      const paginatedPlaylists = (await this.playlistService.getCurrentUserPlaylistsAsync(this.paginatedPlaylists().nextPageToken))!;
      this.paginatedPlaylists.set({
        ...paginatedPlaylists,
        items: this.paginatedPlaylists().items.concat(paginatedPlaylists?.items)
      });
    }
  }

  protected setSelectedPlaylist(playlist: PlaylistInfo) {
    this.selectedPlaylist.set(playlist);
    this.showPlaylistOptions.set(false);
  }

  protected async onPlaylistSelectClick() {
    if (!this.showPlaylistOptions()) {
      this.showPlaylistOptions.set(true);
      if (this.selectedPlaylist()) {
        await this.delay(250); // Let the options render before scrolling to selected item
        const playlistItem = document.getElementById(`playlistOption${this.selectedPlaylist()!.id}`);
        if (playlistItem) playlistItem.scrollIntoView({behavior: "smooth", block: "center"});
      }
    } else this.showPlaylistOptions.set(false);
  }

  protected async saveExistingPlaylist() {
    try {
      this.isLoading.set(true);
      await this.playlistService.addSongAsync(
        this.selectedPlaylist()!.id,
        {
          songYtbId: this.songToAdd.ytbId,
          songArtistName: this.songToAdd.artistName,
          songDuration: this.songToAdd.duration,
          songName: this.songToAdd.name,
          songPublishedAt: this.songToAdd.publishedAt,
          songThumbnailUrl: this.songToAdd.thumbnailUrl,
          songStatus: this.songToAdd.status
        });
      this.showAlert(AlertType.SUCCESS, 'Song added to playlist', 10);
      this.modal()?.close();
    } catch (e) {
      this.isLoading.set(false);
      console.error(e);
      switch ((e as HttpErrorResponse).status) {
        case 409:
          this.showAlert(AlertType.WARNING, 'This song has already been added to this playlist', 10);
          break;
        default:
          throw e;
      }
    }
  }

  //endregion

  //region new playlist

  protected async saveNewPlaylist() {
    try {
      this.isLoading.set(true);
      await this.playlistService.addPlaylistFromSongAsync({
        playlistName: this.addedPlaylist().playlistName,
        songYtbId: this.songToAdd.ytbId,
        songArtistName: this.songToAdd.artistName,
        songDuration: this.songToAdd.duration,
        songName: this.songToAdd.name,
        songPublishedAt: this.songToAdd.publishedAt,
        songThumbnailUrl: this.songToAdd.thumbnailUrl,
        songStatus: this.songToAdd.status
      });
      this.showAlert(AlertType.SUCCESS, 'New playlist added', 10);
      this.modal()?.close();
    } catch (e) {
      this.isLoading.set(false);
      throw e;
    }
  }

  //endregion

  //endregion
}
