import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { ActivationEnd, Router, RouterOutlet } from '@angular/router';
import { AlertDisplay } from './core/components/alert-display/alert-display';
import { AmxComponentBase } from './shared/components/amx-component-base';
import { ConfirmModal } from './core/components/confirm-modal/confirm-modal';
import { Header } from './core/components/header/header';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SongPlayer } from './features/songs/components/song-player/song-player';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertDisplay, ConfirmModal, Header, SongPlayer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App extends AmxComponentBase implements AfterViewInit {
  //region fields

  protected app = viewChild<ElementRef>('app');
  protected showAppLayout = signal(true);

  //endregion

  //region injections

  protected readonly router = inject(Router);
  protected readonly destroyRef = inject(DestroyRef);

  //endregion

  //region methods

  ngAfterViewInit() {
    this.onResize();
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.showAppLayout.set(event.snapshot.data['showAppLayout'] ?? true);
      }
    });
  }

  @HostListener('window:resize')
  protected onResize() {
    this.setScreenWidth(this.app()?.nativeElement.offsetWidth);
  }

  //endregion
}
