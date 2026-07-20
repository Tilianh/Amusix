import { Injectable } from '@angular/core';
import { AmxServiceBase } from '../../../shared/services/amx-service-base';
import { PlaylistInfo } from '../models/playlist-info';
import * as environment from '../../../../environments/environment.json';
import { PaginatedListPage } from '../../../shared/models/paginated-list-page';
import { PlaylistSong } from '../models/playlist-song';
import { PlaylistUpdateForm } from '../models/playlist-update-form';
import { PlaylistAddForm } from '../models/playlist-add-form';
import { PlaylistSongAddForm } from '../models/playlist-song-add-form';
import { PlaylistSongUpdateForm } from '../models/playlist-song-update-form';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService extends AmxServiceBase {
  protected override apiUrl = `${environment.apiUrl}/playlists`;

  /**
   * Get current user's playlists.
   * @param pageToken Returned items page token.
   * @returns Current user's playlists.
   */
  public getCurrentUserPlaylistsAsync(pageToken = '') {
    return this.tryGetAsync<PaginatedListPage<PlaylistInfo>>(`${this.apiUrl}/${pageToken}`);
  }

  /**
   * Get one of the current user's playlists.
   * @param playlistId ID of the playlist to get.
   * @returns Corresponding playlist.
   */
  public getCurrentUserPlaylistAsync(playlistId: string) {
    return this.tryGetAsync<PlaylistInfo>(`${this.apiUrl}/${playlistId}`);
  }

  /**
   * Get the songs contained in of the current user's playlists.
   * @param playlistId ID of the playlist to get the songs from.
   * @param pageToken Returned items page token.
   * @returns Corresponding playlist songs.
   */
  public getPlaylistSongsAsync(playlistId: string, pageToken = '') {
    return this.tryGetAsync<PaginatedListPage<PlaylistSong>>(`${this.apiUrl}/${playlistId}/songs/${pageToken}`);
  }

  /**
   * Add a playlist (from a song) to the current user's.
   * @param playlist Playlist to add.
   * @returns Added playlist.
   */
  public addPlaylistFromSongAsync(playlist: PlaylistAddForm) {
    return this.tryPostAsync<PlaylistAddForm, PlaylistInfo>(`${this.apiUrl}`, playlist);
  }

  /**
   * Update a playlist.
   * @param playlistId ID of the playlist to update.
   * @param playlist Playlist update form.
   * @returns Updated playlist.
   */
  public updatePlaylistAsync(playlistId: string, playlist: PlaylistUpdateForm) {
    return this.tryPutAsync<PlaylistUpdateForm, PlaylistInfo>(`${this.apiUrl}/${playlistId}`, playlist);
  }

  /**
   * Delete a playlist.
   * @param playlistId ID of the playlist to delete.
   * @returns Deleted playlist.
   */
  public deletePlaylistAsync(playlistId: string) {
    return this.tryDeleteAsync<PlaylistInfo>(`${this.apiUrl}/${playlistId}`);
  }

  /**
   * Add a song to one of the current users' playlists.
   * @param playlistId ID of the playlist to add the song to.
   * @param song Song to add.
   * @returns Added song.
   */
  public addSongAsync(playlistId: string, song: PlaylistSongAddForm) {
    return this.tryPostAsync<PlaylistSongAddForm, PlaylistInfo>(`${this.apiUrl}/${playlistId}/songs`, song);
  }

  /**
   * Remove a song from on the current user's playlists.
   * @param playlistId ID of the playlist to remove the song from.
   * @param songId ID of the song to remove from the playlist.
   * @returns Removed song.
   */
  public removeSongAsync(playlistId: string, songId: string) {
    return this.tryDeleteAsync<PlaylistSong>(`${this.apiUrl}/${playlistId}/songs/${songId}`);
  }

  /**
   * Update the status of a song contained in one of the current user's playlists.
   * @param playlistId ID of the playlist containing the song.
   * @param songId ID of the song to update.
   * @param song Song to update.
   * @returns Updated song.
   */
  public updateSongStatusAsync(playlistId: string, songId: string, song: PlaylistSongUpdateForm) {
    return this.tryPutAsync<PlaylistSongUpdateForm, PlaylistSong>(
      `${this.apiUrl}/${playlistId}/songs/${songId}/updateStatus`, song);
  }
}
