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
import { AuthStore, SIGN_IN_GATEWAY } from './features/auth/state/auth.store';

describe('application routes', () => {
  beforeEach(() => {
    window.matchMedia = (query: string) =>
      ({ matches: false, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as MediaQueryList;
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideIcons({ tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff }),
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: SIGN_IN_GATEWAY, useValue: { signIn: () => of({ accessToken: 'token' }), refresh: () => of({ accessToken: 'token' }) } },
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.setTranslation('es', es);
    translate.use('en');
  });

  it('renders the sign-in page at /login', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/login');

    expect(harness.fixture.nativeElement.querySelector('app-sign-in-page')).not.toBeNull();
  });

  it('loads the main route lazily', () => {
    const mainRoute = routes.find((route) => route.path === '');

    expect(mainRoute?.loadComponent).toBeTypeOf('function');
  });

  it('redirects / to the sign-in page without a session', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/');

    expect(TestBed.inject(Router).url).toBe('/login');
  });

  it('renders the main layout at / with no text in this change', async () => {
    TestBed.inject(AuthStore).setAccessToken('token');
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/');

    const layout = harness.fixture.nativeElement.querySelector('app-main-layout');
    expect(layout).not.toBeNull();
    expect(layout?.textContent?.trim()).toBe('');
  });
});
