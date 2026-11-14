import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerEye, tablerEyeOff, tablerLanguage, tablerLock, tablerUser } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import en from '../../../../packages/shared/i18n/en.json';
import es from '../../../../packages/shared/i18n/es.json';
import { routes } from './app.routes';
import { SIGN_IN_GATEWAY } from './features/auth/state/auth.store';

describe('registration route', () => {
  beforeEach(() => {
    window.matchMedia = (query: string) =>
      ({ matches: false, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as MediaQueryList;
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideIcons({ tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff }),
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: SIGN_IN_GATEWAY,
          useValue: {
            signIn: () => of({ accessToken: 'token' }),
            refresh: () => of({ accessToken: 'token' }),
            register: () => of(undefined),
          },
        },
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.setTranslation('es', es);
    translate.use('en');
  });

  it('renders the registration page at /register without a session', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/register');

    expect(TestBed.inject(Router).url).toBe('/register');
    expect(harness.fixture.nativeElement.querySelector('app-register-page')).not.toBeNull();
  });

  it('loads the registration page lazily', () => {
    const registerRoute = routes.find((route) => route.path === 'register');

    expect(registerRoute?.loadComponent).toBeTypeOf('function');
    expect(registerRoute?.canActivate).toBeUndefined();
  });
});
