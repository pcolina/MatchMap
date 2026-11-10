import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIcons } from '@ng-icons/core';
import { tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerEye, tablerEyeOff, tablerLanguage, tablerLock, tablerUser } from '@ng-icons/tabler-icons';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { provideRouter } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { authInterceptor } from './core/auth/auth.interceptor';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { setupTranslations } from './core/i18n/language';
import { AuthApi } from './features/auth/data/auth.api';
import { AuthStore, SIGN_IN_GATEWAY } from './features/auth/state/auth.store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIcons({ tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff }),
    provideRouter(routes),
    provideTranslateService({ fallbackLang: 'en' }),
    provideAppInitializer(() => setupTranslations(inject(TranslateService), navigator.language)),
    provideAppInitializer(() => {
      const store = inject(AuthStore);
      store.restore();
      return firstValueFrom(toObservable(store.sessionChecked).pipe(filter(Boolean)));
    }),
    { provide: SIGN_IN_GATEWAY, useExisting: AuthApi }
  ]
};
