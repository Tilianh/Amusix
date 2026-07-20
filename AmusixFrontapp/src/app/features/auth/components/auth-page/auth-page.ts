import { Component, input } from '@angular/core';

/** Page to display an authentication form. */
@Component({
  selector: 'app-auth-page',
  imports: [],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  //region parameters

  /** Page title. */
  public title = input<string>();

  //endregion
}
