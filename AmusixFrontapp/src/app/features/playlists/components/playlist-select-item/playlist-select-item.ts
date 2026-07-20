import { Component, input, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { PlaylistInfo } from '../../models/playlist-info';

/** Template to display a playlist as an item of a select-list. */
@Component({
  selector: 'app-playlist-select-item',
  imports: [NgOptimizedImage],
  templateUrl: './playlist-select-item.html',
  styleUrl: './playlist-select-item.scss'
})
export class PlaylistSelectItem extends AmxComponentBase {
  //region parameters

  /** Playlist info. */
  playlist = input.required<PlaylistInfo>();

  /** If the item in selected. */
  public selected = input<boolean>();

  /** If the item is disabled / can't be selected. */
  public disabled = input<boolean>();

  /** Notify when the item is clicked. */
  public onClicked = output();

  //endregion

  //region fields

  protected isPlaylistThumbnailLoading = signal(true);
  protected isPlaylistThumbnailNotFound = signal(false);

  //endregion
}
