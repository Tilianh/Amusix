import { Component, input, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { PlaylistInfo } from '../../models/playlist-info';
import { RouterLink } from '@angular/router';

/** Template to display a playlist as an item in a list. */
@Component({
  selector: 'app-playlist-item',
  imports: [DatePipe, NgOptimizedImage, RouterLink],
  templateUrl: './playlist-item.html',
  styleUrl: './playlist-item.scss'
})
export class PlaylistItem extends AmxComponentBase {
  //region parameters

  /** Playlist info. */
  public playlist = input.required<PlaylistInfo>();

  /** Index of the playlist in the list it is contained in. */
  public index = input<number>();

  //endregion

  //region fields

  protected isPlaylistThumbnailLoading = signal(true);
  protected isPlaylistThumbnailNotFound = signal(false);

  //endregion
}
