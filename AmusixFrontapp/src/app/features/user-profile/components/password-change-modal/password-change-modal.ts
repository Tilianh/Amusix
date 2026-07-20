import { Component, inject, signal, viewChild } from '@angular/core';
import { Modal } from '../../../../shared/components/modal/modal';
import { FormsModule } from '@angular/forms';
import { form, FormField, maxLength, pattern, required, validate } from '@angular/forms/signals';
import { UserPasswordUpdateForm } from '../../models/user-password-update-form';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { AlertType } from '../../../../shared/enums/alert-type';
import { HttpErrorResponse } from '@angular/common/http';
import { Loading } from '../../../../shared/components/loading/loading';
import { CookieService } from '../../../../shared/services/cookie-service';
import { Constants } from '../../../../shared/constants';

/** Modal to change current user's password. */
@Component({
  selector: 'app-password-change-modal',
  imports: [
    Modal,
    FormsModule,
    FormField,
    Loading
  ],
  templateUrl: './password-change-modal.html',
  styleUrl: './password-change-modal.scss'
})
export class PasswordChangeModal extends AmxComponentBase {
  //region fields

  protected isLoading = signal(false);
  protected modal = viewChild<Modal>('modal');

  protected editedPasswords = signal(new UserPasswordUpdateForm());
  protected passwordUpdateForm = form(this.editedPasswords, x => {
    required(x.oldPassword);
    maxLength(x.oldPassword, 100);
    pattern(x.newPassword, /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s:])(\S){6,100}$/);
    maxLength(x.newPassword, 100);
    validate(x.confirmPassword, (y) => {
      if (y.value() != y.valueOf(x.newPassword))
        return {kind: 'passwordMismatch', message: `Passwords don't match`};
      return null;
    });
    maxLength(x.confirmPassword, 100);
  });

  //endregion

  //region injections

  protected readonly userService = inject(UserService);
  protected readonly cookieService = inject(CookieService);
  protected readonly router = inject(Router);

  //endregion

  //region methods

  /** Open modal */
  public open() {
    this.passwordUpdateForm().controlValue.set(new UserPasswordUpdateForm());
    this.passwordUpdateForm().reset();
    this.isLoading.set(false);
    this.modal()?.open();
  }

  protected async changePassword() {
    this.showConfirm(`Update your current password? You'll have to log in again.`, async () => {
      try {
        this.isLoading.set(true);
        await this.userService.updateCurrentUserPasswordAsync(this.editedPasswords());
        this.cookieService.removeCookie(Constants.ACCESS_TOKEN_COOKIE_KEY);
        await this.router.navigateByUrl('/login');
        this.showAlert(AlertType.SUCCESS, 'Password updated, you can now log in again', 10);
      } catch (e) {
        let errorMsg;
        console.log(e);
        switch ((e as HttpErrorResponse).status) {
          case 403:
            errorMsg = 'Either the current or the new password is not valid';
            break;
          case 409:
            errorMsg = `Current password and new password can't be the same`;
            break;
          default:
            errorMsg = 'An error occurred';
        }
        this.showAlert(AlertType.ERROR, errorMsg, 10);
        this.isLoading.set(false);
        console.error(e);
      }
    });
  }

  //endregion
}
