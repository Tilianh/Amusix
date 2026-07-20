import { Component, inject } from '@angular/core';
import { PlaylistService } from '../../services/playlist-service';
import { PlaylistItem } from '../playlist-item/playlist-item';
import { DynamicPaginatedList } from '../../../../shared/components/dynamic-paginated-list/dynamic-paginated-list';

@Component({
  selector: 'app-my-playlists',
  imports: [PlaylistItem, DynamicPaginatedList],
  templateUrl: './my-playlists.html',
  styleUrl: './my-playlists.scss'
})
export class MyPlaylists {
  protected readonly playlistService = inject(PlaylistService);
}
