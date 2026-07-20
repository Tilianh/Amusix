import { ErrorHandler } from '@angular/core';
import { AmxComponentBase } from './components/amx-component-base';
import { AlertType } from './enums/alert-type';
import { SilentError } from './errors/silent-error';

export class AmxErrorHandler extends AmxComponentBase implements ErrorHandler {
  handleError(error: Error) {
    if (!(error instanceof SilentError)) // Don't display 'silent' errors
      this.showAlert(AlertType.ERROR, 'An unexpected error occurred', 10);
    console.error(error);
  }
}
