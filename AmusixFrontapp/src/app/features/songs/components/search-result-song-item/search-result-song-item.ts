import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { SongStatus } from '../../../../shared/enums/song-status';
import { SongPlayerService } from '../../services/song-player.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchResultSong } from '../../models/search-result-song';
import { Util } from '../../../../shared/util';

/** Template to display a search result song as an item of a list. */
@Component({
  selector: 'app-search-result-song-item',
  imports: [DatePipe, NgOptimizedImage],
  templateUrl: './search-result-song-item.html',
  styleUrl: './search-result-song-item.scss'
})
export class SearchResultSongItem extends AmxComponentBase implements OnInit {
  //region parameters

  /** Song info. */
  public song = input.required<SearchResultSong>();

  /** Notify when a request is made to add the song to a playlist. */
  public onAddToPlaylist = output();

  //endregion

  //region field

  protected formattedSongDuration = computed(() => Util.formateDuration(this.song().duration));
  protected isSongThumbnailLoading = signal(true);
  protected isSongThumbnailNotFound = signal(false);
  protected isSongBeingPlayed = signal(false);

  //endregion

  //region injections

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
    this.songPlayerService.playSong({
      ytbId: this.song().ytbId,
      status: SongStatus.VALID,
      thumbnailUrl: this.song().thumbnailUrl,
      artistName: this.song().artistName,
      name: this.song().name,
      publishedAt: this.song().publishedAt,
      duration: this.song().duration
    });
  }

  //endregion
}
