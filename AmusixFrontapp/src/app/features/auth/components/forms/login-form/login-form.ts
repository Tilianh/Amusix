import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthPage } from '../../auth-page/auth-page';
import { form, FormField, required } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertType } from '../../../../../shared/enums/alert-type';
import { AuthService } from '../../../services/auth-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginUserForm } from '../../../models/login-user-form';
import { AmxComponentBase } from '../../../../../shared/components/amx-component-base';
import { Loading } from '../../../../../shared/components/loading/loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Constants } from '../../../../../shared/constants';
import { CookieService } from '../../../../../shared/services/cookie-service';

@Component({
  selector: 'app-register-form',
  imports: [AuthPage, FormField, Loading, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm extends AmxComponentBase implements OnInit {
  //region fields

  protected isLoading = signal(false);
  protected loginUser = signal(new LoginUserForm());
  protected loginForm = form(this.loginUser, x => {
    required(x.username);
    required(x.password);
  });
  returnUrl = '';

  //endregion

  //region injections

  protected readonly authService = inject(AuthService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly cookieService = inject(CookieService);

  //endregion

  //region methods

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] ?? '/my-playlists';
  }

  protected async loginUserAsync() {
    try {
      this.isLoading.set(true);
      const token = (await this.authService.loginUserAsync(this.loginUser())).accessToken;
      this.cookieService.setCookie(Constants.ACCESS_TOKEN_COOKIE_KEY, token);
      location.href = this.returnUrl;
    } catch (e) {
      let errorMsg;
      switch ((e as HttpErrorResponse).status) {
        case 404:
          errorMsg = 'User not found for this username';
          break;
        case 401:
          errorMsg = 'Invalid password';
          break;
        default:
          errorMsg = 'An error occurred';
      }
      this.showAlert(AlertType.ERROR, errorMsg, 10);
      console.error(e);
      this.isLoading.set(false);
    }
  }

  //endregion
}
