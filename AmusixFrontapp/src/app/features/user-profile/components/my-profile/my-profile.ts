import { Component, inject, OnInit, signal } from '@angular/core';
import { Loading } from '../../../../shared/components/loading/loading';
import { UserService } from '../../services/user-service';
import { UserInfo } from '../../models/user-info';
import { DatePipe } from '@angular/common';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { Router, RouterLink } from '@angular/router';
import { PasswordChangeModal } from '../password-change-modal/password-change-modal';
import { Constants } from '../../../../shared/constants';
import { CookieService } from '../../../../shared/services/cookie-service';

@Component({
  selector: 'app-my-profile',
  imports: [
    Loading,
    DatePipe,
    RouterLink,
    PasswordChangeModal
  ],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss'
})
export class MyProfile extends AmxComponentBase implements OnInit {
  //region fields

  protected userInfo = signal(new UserInfo());
  protected isLoading = signal(true);

  //endregion

  //region injections

  protected readonly userService = inject(UserService);
  protected readonly cookieService = inject(CookieService);
  protected readonly router = inject(Router);

  //endregion

  //region methods

  async ngOnInit() {
    this.userInfo.set((await this.userService.getCurrentUserAsync())!);
    this.isLoading.set(false);
  }

  protected logout() {
    this.showConfirm('Log out of Amusix? You will be redirected to the home page.', async () => {
      this.cookieService.removeCookie(Constants.ACCESS_TOKEN_COOKIE_KEY);
      await this.router.navigateByUrl('/');
    });
  }

  //endregion
}
