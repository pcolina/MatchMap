import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIcons } from '@ng-icons/core';
import { tablerAlertCircle, tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerEye, tablerEyeOff, tablerLanguage, tablerLock, tablerUser } from '@ng-icons/tabler-icons';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/cache';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { filter, firstValueFrom } from 'rxjs';
import { authInterceptor } from './core/auth/auth.interceptor';
import { mockEnabled } from './core/mocks/mock-flag';
import { apolloLinkFor, httpInterceptorsFor } from './core/mocks/mock-wiring';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { setupTranslations } from './core/i18n/language';
import { trackInputModality } from './core/input-modality';
import { graphqlUrl } from './core/api-url';
import { environment } from '../environments/environment';
import { AuthApi } from './features/auth/data/auth.api';
import { AuthStore, SIGN_IN_GATEWAY } from './features/auth/state/auth.store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors(httpInterceptorsFor(mockEnabled, authInterceptor))),
    provideApollo(() => ({
      link: apolloLinkFor(mockEnabled, inject(HttpLink).create({ uri: graphqlUrl(environment.apiBaseUrl) })),
      cache: new InMemoryCache(),
    })),
    provideIcons({ tablerAlertCircle, tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff }),
    provideRouter(routes),
    provideTranslateService({ fallbackLang: 'en' }),
    provideAppInitializer(() => setupTranslations(inject(TranslateService), navigator.language)),
    provideAppInitializer(() => {
      trackInputModality(document);
    }),
    provideAppInitializer(() => {
      const store = inject(AuthStore);
      store.restore();
      return firstValueFrom(toObservable(store.sessionChecked).pipe(filter(Boolean)));
    }),
    { provide: SIGN_IN_GATEWAY, useExisting: AuthApi }
  ]
};
