import { Component, inject, signal } from '@angular/core';
import { AuthPage } from '../../auth-page/auth-page';
import { RegisterUserForm } from '../../../models/register-user-form';
import { form, FormField, maxLength, pattern, required, validate } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertType } from '../../../../../shared/enums/alert-type';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { AmxComponentBase } from '../../../../../shared/components/amx-component-base';
import { Loading } from '../../../../../shared/components/loading/loading';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  imports: [AuthPage, FormField, Loading, RouterLink, FormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss'
})
export class RegisterForm extends AmxComponentBase {
  //region fields

  protected isLoading = signal(false);
  protected registerUser = signal(new RegisterUserForm());
  protected registerForm = form(this.registerUser, x => {
    required(x.username);
    pattern(x.username, /^(?=.*[a-z])(?=.*[0-9\-_]?)(\S){5,256}$/);
    maxLength(x.username, 100);
    maxLength(x.displayName, 100);
    pattern(x.password, /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s:])(\S){6,100}$/);
    maxLength(x.password, 100);
    validate(x.confirmPassword, (y) => {
      if (y.value() != y.valueOf(x.password))
        return {kind: 'passwordMismatch', message: `Passwords don't match`};
      return null;
    });
    maxLength(x.confirmPassword, 100);
  });

  //endregion

  //region injections

  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  //endregion

  //region methods

  protected async registerUserAsync() {
    try {
      this.isLoading.set(true);
      await this.authService.registerUserAsync(this.registerUser());
      this.showAlert(AlertType.SUCCESS, 'User registered, you can now log in', 10);
      await this.router.navigateByUrl('/login');
    } catch (e) {
      let errorMsg;
      switch ((e as HttpErrorResponse).status) {
        case 409:
          errorMsg = 'Username already taken';
          break;
        case 403:
          errorMsg = 'Insufficient password strength';
          break;
        default:
          errorMsg = 'An error occurred';
      }
      this.showAlert(AlertType.ERROR, errorMsg, 10);
      console.error(e);
    }
    this.isLoading.set(false);
  }

  //endregion
}
