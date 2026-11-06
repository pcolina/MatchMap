import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthApi } from './features/auth/data/auth.api';
import { SIGN_IN_GATEWAY } from './features/auth/state/auth.store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    { provide: SIGN_IN_GATEWAY, useExisting: AuthApi }
  ]
};
