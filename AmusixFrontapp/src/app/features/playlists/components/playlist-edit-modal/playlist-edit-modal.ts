import { Component, inject, output, signal, viewChild } from '@angular/core';
import { Modal } from '../../../../shared/components/modal/modal';
import { PlaylistInfo } from '../../models/playlist-info';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { PlaylistUpdateForm } from '../../models/playlist-update-form';
import { FormsModule } from '@angular/forms';
import { PlaylistService } from '../../services/playlist-service';
import { Loading } from '../../../../shared/components/loading/loading';

/** Modal to edit a playlist. */
@Component({
  selector: 'app-playlist-edit-modal',
  imports: [
    Modal,
    FormsModule,
    FormField,
    Loading
  ],
  templateUrl: './playlist-edit-modal.html',
  styleUrl: './playlist-edit-modal.scss'
})
export class PlaylistEditModal {
  //region parameters

  /** Notify when playlist is updated. */
  public onUpdated = output();

  //endregion

  //region fields

  protected isLoading = signal(false);
  protected modal = viewChild<Modal>('modal');

  protected playlistId = '';
  protected editedPlaylist = signal(new PlaylistUpdateForm());
  protected playlistForm = form(this.editedPlaylist, x => {
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
   * @param playlist Playlist to edit.
   */
  public open(playlist: PlaylistInfo) {
    this.playlistId = playlist.id;
    this.playlistForm().controlValue.set({playlistName: playlist.name});
    this.isLoading.set(false);
    this.modal()?.open();
  }

  protected async savePlaylist() {
    try {
      this.isLoading.set(true);
      await this.playlistService.updatePlaylistAsync(this.playlistId, this.editedPlaylist());
      this.onUpdated.emit();
      this.modal()?.close();
    } catch (e) {
      this.isLoading.set(false);
      throw e;
    }
  }

  //endregion
}
