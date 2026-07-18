import { Injectable } from '@angular/core';
import { AmxServiceBase } from '../../../shared/services/amx-service-base';
import * as environment from '../../../../environments/environment.json';
import { UserInfo } from '../models/user-info';
import { UserPasswordUpdateForm } from '../models/user-password-update-form';

@Injectable({
  providedIn: 'root',
})
export class UserService extends AmxServiceBase {
  protected override apiUrl = `${environment.apiUrl}/users`;

  /** Get current user data. */
  public getCurrentUserAsync() {
    return this.tryGetAsync<UserInfo>(`${this.apiUrl}/current`);
  }

  /**
   * Update current user's password.
   * @param userForm User password update form.
   */
  public updateCurrentUserPasswordAsync(userForm: UserPasswordUpdateForm) {
    return this.tryPutAsync<UserPasswordUpdateForm, undefined>(`${this.apiUrl}/current/updatePassword`, userForm);
  }
}
