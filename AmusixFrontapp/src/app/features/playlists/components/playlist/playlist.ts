import { Component, inject, OnInit, signal } from '@angular/core';
import { PlaylistService } from '../../services/playlist-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlaylistInfo } from '../../models/playlist-info';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { PlaylistSongItem } from '../playlist-song-item/playlist-song-item';
import { Modal } from '../../../../shared/components/modal/modal';
import { DatePipe } from '@angular/common';
import { PlaylistEditModal } from '../playlist-edit-modal/playlist-edit-modal';
import { DynamicPaginatedList } from '../../../../shared/components/dynamic-paginated-list/dynamic-paginated-list';
import { Loading } from '../../../../shared/components/loading/loading';
import { AddPlaylistSongModal } from '../add-playlist-song-modal/add-playlist-song-modal';

@Component({
  selector: 'app-playlist',
  imports: [
    RouterLink,
    PlaylistSongItem,
    Modal,
    DatePipe,
    PlaylistEditModal,
    DynamicPaginatedList,
    Loading,
    AddPlaylistSongModal
  ],
  templateUrl: './playlist.html',
  styleUrl: './playlist.scss'
})
export class Playlist extends AmxComponentBase implements OnInit {
  //region fields

  protected isLoading = signal(true);
  protected playlist = signal(new PlaylistInfo());

  //endregion

  //region injections

  readonly playlistService = inject(PlaylistService);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);

  //endregion

  //region methods

  async ngOnInit() {
    this.isLoading.set(true);
    const playlistId = this.activatedRoute.snapshot.params['id'];
    this.playlist.set((await this.playlistService.getCurrentUserPlaylistAsync(playlistId))!);
    this.isLoading.set(false);
  }

  protected deletePlaylist() {
    this.showConfirm('Delete this playlist and all songs saved in?', async () => {
      await this.playlistService.deletePlaylistAsync(this.playlist().id);
      await this.router.navigateByUrl('/my-playlists');
    });
  }

  //endregion
}
