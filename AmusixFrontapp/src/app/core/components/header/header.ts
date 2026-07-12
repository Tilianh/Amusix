import { Component, signal } from '@angular/core';
import packageFile from '../../../../../package.json';
import { Modal } from '../../../shared/components/modal/modal';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SongSearchBar } from '../../../features/songs/components/song-search-bar/song-search-bar';

@Component({
  selector: 'app-header',
  imports: [
    Modal,
    RouterLink,
    SongSearchBar,
    RouterLinkActive
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  protected appVersion = signal(packageFile.version);
}
