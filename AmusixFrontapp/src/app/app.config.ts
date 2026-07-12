import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AmxErrorHandler } from './shared/amx-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: AmxErrorHandler },
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
