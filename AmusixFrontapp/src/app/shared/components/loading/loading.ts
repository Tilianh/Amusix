import { Component, input } from '@angular/core';

/** Display a loading spinner. */
@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class Loading {
  //region parameters

  /** If the component is loading. */
  public isLoading = input(true);

  /** Text to show during the loading. */
  public loadingText = input<string>();

  //endregion
}
