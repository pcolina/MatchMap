import { provideHttpClient } from '@angular/common/http';
import { provideIcons } from '@ng-icons/core';
import { lucideLanguages } from '@ng-icons/lucide';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { setupTranslations } from './core/i18n/language';
import { AuthApi } from './features/auth/data/auth.api';
import { SIGN_IN_GATEWAY } from './features/auth/state/auth.store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideIcons({ lucideLanguages }),
    provideRouter(routes),
    provideTranslateService({ fallbackLang: 'en' }),
    provideAppInitializer(() => setupTranslations(inject(TranslateService), navigator.language)),
    { provide: SIGN_IN_GATEWAY, useExisting: AuthApi }
  ]
};
