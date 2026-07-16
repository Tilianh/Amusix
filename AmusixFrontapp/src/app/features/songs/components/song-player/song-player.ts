import { AfterViewInit, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { YouTubePlayer } from 'youtube-player/dist/types';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';
import { SongPlayerDisplayMode } from '../../../../shared/enums/song-player-display-mode';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { SongStatus } from '../../../../shared/enums/song-status';
import PlayerFactory from 'youtube-player/dist';
import { SongPlayerService } from '../../services/song-player.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlaylistService } from '../../../playlists/services/playlist-service';
import { AlertType } from '../../../../shared/enums/alert-type';
import { Util } from '../../../../shared/util';
import { SongInfo } from '../../models/song-info';

/** Song player. */
@Component({
  selector: 'app-song-player',
  imports: [
    NgOptimizedImage,
    NgTemplateOutlet
  ],
  templateUrl: './song-player.html',
  styleUrl: './song-player.scss'
})
export class SongPlayer extends AmxComponentBase implements AfterViewInit {
  //region fields

  // Component

  protected isLoading = signal(true);
  protected videoPlayer = viewChild<ElementRef>('videoPlayer');
  protected playerDisplayMode = signal(SongPlayerDisplayMode.HIDDEN);
  protected hasError = false;

  // Song player

  protected playedSong = signal(new SongInfo());
  protected songProgression = signal(0);
  protected songVolumePercentage = signal(0);
  protected isSongMuted = signal(false);
  protected songTotalDuration = signal(0);
  protected songFormattedTotalDuration = signal('00:00');
  protected songFormattedCurrentTime = signal('00:00');

  // YouTube player

  protected ytbPlayer!: YouTubePlayer;
  protected ytbPlayerState = signal(PlayerStates.UNSTARTED);
  protected isFirstSongPlayed = true;

  // Song thumbnail

  protected isSongThumbnailLoading = signal(true);
  protected isSongThumbnailNotFound = signal(false);

  //endregion

  //region injections

  protected readonly SongPlayerState = SongPlayerDisplayMode;
  protected readonly PlayerStates = PlayerStates;
  protected readonly SongStatus = SongStatus;
  protected readonly songPlayerService = inject(SongPlayerService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly playlistService = inject(PlaylistService);

  //endregion

  //region methods

  //region initialization

  async ngAfterViewInit() {
    this.ytbPlayer = PlayerFactory(
      this.videoPlayer()?.nativeElement,
      {
        playerVars: {
          autoplay: 1,
          cc_load_policy: 1,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0
        },
        width: 1,
        height: 1
      }
    );
    await this.changeVolume(25);

    // Update song status if song can't be played
    this.ytbPlayer.on('error', async () => this.setSongInvalid());

    // Play song
    this.songPlayerService.playedSongObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async song => {
      if (song) await this.playSong(song);
    });

    // Update song timeline display each second the player is open
    setInterval(
      async () => {
        if (this.playerDisplayMode() != SongPlayerDisplayMode.HIDDEN && !this.hasError) {
          this.ytbPlayerState.set(await this.ytbPlayer.getPlayerState() ?? PlayerStates.UNSTARTED);
          switch (this.ytbPlayerState()) {
            case PlayerStates.PLAYING:
              this.updateTimelineDisplay(await this.ytbPlayer.getCurrentTime() ?? 0);
              break;
            case PlayerStates.ENDED:
              this.updateTimelineDisplay(this.songTotalDuration());
              break;
          }
        }
      },
      1000
    );
  }

  protected async setSongInvalid() {
    this.hasError = true;
    if (this.playedSong().status != SongStatus.NOT_VALID && this.playedSong().playlistId) {
      await this.playlistService.updateSongStatusAsync(
        this.playedSong().playlistId!,
        this.playedSong().ytbId,
        {songStatus: SongStatus.NOT_VALID}
      );
      this.playedSong().status = SongStatus.NOT_VALID;
    }
    this.showAlert(AlertType.ERROR, `This song can't be played`, 10);
  }

  //endregion

  //region player

  protected async closePlayer() {
    await this.ytbPlayer.stopVideo();
    this.songPlayerService.stopSong();
    this.playerDisplayMode.set(SongPlayerDisplayMode.HIDDEN);
  }

  //endregion

  //region song

  protected async playSong(song: SongInfo) {
    this.isLoading.set(true);

    // Set song data
    this.playedSong.set(song);
    this.songTotalDuration.set(song.duration);
    this.songFormattedTotalDuration.set(Util.formateDuration(song.duration));

    // Open player
    if (this.playerDisplayMode() == SongPlayerDisplayMode.HIDDEN)
      this.playerDisplayMode.set(SongPlayerDisplayMode.FULL_SCREEN);

    if (this.isFirstSongPlayed) this.isFirstSongPlayed = false;
    else await this.ytbPlayer.stopVideo();

    // Load song
    await this.ytbPlayer.loadVideoById(song.ytbId);
    await this.ytbPlayer.playVideo();

    this.isLoading.set(false);
  }

  protected async pauseSong() {
    this.ytbPlayerState.set(PlayerStates.PAUSED);
    await this.ytbPlayer.pauseVideo();
  }

  protected async resumeSong() {
    this.ytbPlayerState.set(PlayerStates.PLAYING);
    await this.ytbPlayer.playVideo();
  }

  protected async restartSong() {
    this.ytbPlayerState.set(PlayerStates.UNSTARTED);
    await this.ytbPlayer.playVideo();
  }

  /** @param index Song index in seconds. */
  protected async changeSongTimestamp(index: number) {
    this.updateTimelineDisplay(index);
    await this.ytbPlayer.seekTo(index, true);
  }

  /** @param index Song index in seconds. */
  protected updateTimelineDisplay(index: number) {
    this.songProgression.set(index / this.songTotalDuration() * 100);
    this.songFormattedCurrentTime.set(Util.formateDuration(index));
  }

  //endregion

  //region volume

  protected async muteVolume() {
    this.isSongMuted.set(true);
    await this.ytbPlayer.setVolume(0);
  }

  protected async unmuteVolume() {
    this.isSongMuted.set(false);
    await this.changeVolume(this.songVolumePercentage());
  }

  /** @param volume Volume percentage (50 = 50%). */
  protected async changeVolume(volume: number) {
    await this.ytbPlayer.setVolume(volume);
    this.isSongMuted.set(volume == 0);
    this.songVolumePercentage.set(volume);
  }

  //endregion

  //endregion
}
