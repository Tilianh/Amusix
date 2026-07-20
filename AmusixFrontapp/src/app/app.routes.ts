import { Routes } from '@angular/router';
import { RegisterForm } from './features/auth/components/forms/register-form/register-form';
import { LoginForm } from './features/auth/components/forms/login-form/login-form';
import { MyPlaylists } from './features/playlists/components/my-playlists/my-playlists';
import { HomePage } from './features/home-page/home-page';
import { MyProfile } from './features/user-profile/components/my-profile/my-profile';
import { Playlist } from './features/playlists/components/playlist/playlist';
import { SongSearchResults } from './features/songs/components/song-search-results/song-search-results';

export const routes: Routes = [
  {path: 'register', component: RegisterForm, data: {showAppLayout: false}},
  {path: 'login', component: LoginForm, data: {showAppLayout: false}},
  {path: 'my-profile', component: MyProfile},
  {path: 'my-playlists', component: MyPlaylists},
  {path: 'my-playlists/:id', component: Playlist},
  {path: 'search-songs/:searchText', component: SongSearchResults},
  {path: '', component: HomePage, data: {showAppLayout: false}},
  {path: '**', redirectTo: ''}
];
