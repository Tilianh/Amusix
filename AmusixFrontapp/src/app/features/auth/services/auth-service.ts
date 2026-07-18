import { Injectable } from '@angular/core';
import { RegisterUserForm } from '../models/register-user-form';
import { firstValueFrom } from 'rxjs';
import * as environment from '../../../../environments/environment.json';
import { LoginUserForm } from '../models/login-user-form';
import { AmxServiceBase } from '../../../shared/services/amx-service-base';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AmxServiceBase {
  protected override apiUrl = `${environment.apiUrl}/users`;

  /**
   * Register a new user.
   * @param user User to register.
   */
  public registerUserAsync(user: RegisterUserForm) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/register`, user));
  }

  /**
   * Try to log in a user.
   * @param user User to log in.
   * @returns The corresponding access token if the authentication is successful.
   */
  public loginUserAsync(user: LoginUserForm) {
    return firstValueFrom(this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, user));
  }
}
