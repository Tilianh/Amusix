import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SongInfo } from '../models/song-info';

@Injectable({
  providedIn: 'root'
})
export class SongPlayerService {
  private static playedSongBS = new BehaviorSubject<SongInfo | undefined>(undefined);

  /**
   * Get an observable of the current song ton play.
   * @returns An observable of the corresponding song.
   */
  public get playedSongObservable(): Observable<SongInfo | undefined> {
    return SongPlayerService.playedSongBS.asObservable();
  }

  /**
   * Play a song in the song player.
   * @param song Song to play.
   */
  public playSong(song: SongInfo) {
    SongPlayerService.playedSongBS.next(song);
  }

  /** Stop song currently played in the song player. */
  public stopSong() {
    SongPlayerService.playedSongBS.next(undefined);
  }
}
