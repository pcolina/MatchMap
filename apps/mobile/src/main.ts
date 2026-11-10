import 'expo';
import { AppRegistry, Image, Platform, processColor } from 'react-native';
import * as Font from 'expo-font';
import { inject, provideAppInitializer } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { filter, firstValueFrom } from 'rxjs';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideIcons } from '@ng-icons/core';
import { tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerEye, tablerEyeOff, tablerLanguage, tablerLock, tablerUser } from '@ng-icons/tabler-icons';
import { provideNativeRouter } from '@ng-native/router';
import { mount } from '@ng-native/platform';
import { provideNativeHttpClient } from '@ng-native/platform/http';
import { currentConditions, deviceTokens, watchConditions } from '@ng-native/device';
import { getFabricUIManager, registerPlatformComponents } from '@ng-native/fabric';
import en from '../../../packages/shared/i18n/en.json';
import es from '../../../packages/shared/i18n/es.json';
import { App } from './app/app.ts';
import { routes } from './app/app.routes.ts';
import { authInterceptor } from './app/core/auth/auth.interceptor.ts';
import { deviceLocale, resolveLanguage } from './app/core/i18n/language.ts';
import { appFonts } from './app/core/fonts/fonts.ts';
import { AuthApi } from './app/features/auth/data/auth.api.ts';
import { AuthStore, SIGN_IN_GATEWAY } from './app/features/auth/state/auth.store.ts';

registerPlatformComponents(Platform.OS);

const appProviders = [
  provideNativeRouter(routes),
  provideNativeHttpClient(withInterceptors([authInterceptor])),
  provideTranslateService({ fallbackLang: 'en' }),
  provideIcons({ tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff }),
  provideAppInitializer(() => Font.loadAsync(appFonts)),
  provideAppInitializer(() => {
    const translate = inject(TranslateService);
    translate.setTranslation('en', en);
    translate.setTranslation('es', es);
    translate.use(resolveLanguage(deviceLocale()));
  }),
  { provide: SIGN_IN_GATEWAY, useExisting: AuthApi },
  provideAppInitializer(() => {
    const store = inject(AuthStore);
    store.restore();
    return firstValueFrom(toObservable(store.sessionChecked).pipe(filter(Boolean)));
  }),
];

AppRegistry.registerRunnable('main', ({ rootTag }: { rootTag: number | string }) => {
  const app = mount(Number(rootTag), App, getFabricUIManager(), {
    processColor,
    conditions: currentConditions(),
    tokens: deviceTokens(),
    resolveAssetSource: (value) => Image.resolveAssetSource(value as never),
    providers: appProviders,
  });
  watchConditions(app.engine);
});
