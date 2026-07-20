import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { PlaylistSong } from '../../models/playlist-song';
import { SongStatus } from '../../../../shared/enums/song-status';
import { PlaylistService } from '../../services/playlist-service';
import { SongPlayerService } from '../../../songs/services/song-player.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Util } from '../../../../shared/util';

/** Template to display a song as an item in a list. */
@Component({
  selector: 'app-playlist-song-item',
  imports: [DatePipe, NgOptimizedImage],
  templateUrl: './playlist-song-item.html',
  styleUrl: './playlist-song-item.scss'
})
export class PlaylistSongItem extends AmxComponentBase implements OnInit {
  //region parameters

  /** Song info. */
  public song = input.required<PlaylistSong>();

  /** Index of the song in the list it is contained in. */
  public index = input<number>();

  /** Notify when the song is removed. */
  public onRemoved = output();

  /** Notify when a request is made to add the song to a playlist. */
  public onAddToPlaylist = output();

  //endregion

  //region fields

  protected formattedDuration = computed(() => Util.formateDuration(this.song().duration));
  protected isSongThumbnailLoading = signal(true);
  protected isSongThumbnailNotFound = signal(false);
  protected isSongBeingPlayed = signal(false);

  //endregion

  //region injections

  protected readonly SongStatus = SongStatus;
  protected readonly playlistService = inject(PlaylistService);
  protected readonly songPlayerService = inject(SongPlayerService);
  protected readonly destroyRef = inject(DestroyRef);

  //endregion

  //region methods

  ngOnInit() {
    this.songPlayerService.playedSongObservable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(song => this.isSongBeingPlayed.set(this.song().ytbId == song?.ytbId));
  }

  protected playSong() {
    this.songPlayerService.playSong(this.song());
  }

  protected async removeSongFromPlaylist() {
    this.showConfirm('Remove this song from this playlist?', async () => {
      await this.playlistService.removeSongAsync(this.song().playlistId, this.song().ytbId);
      this.onRemoved.emit();
    });
  }

  //endregion
}
