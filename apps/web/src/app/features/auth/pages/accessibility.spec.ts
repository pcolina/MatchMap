import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerEye, tablerEyeOff, tablerInfoCircle, tablerLanguage, tablerLock, tablerMap, tablerPlus, tablerUser, tablerUsers, tablerWorld } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import axe from 'axe-core';
import { of, throwError } from 'rxjs';
import en from '../../../../../../../packages/shared/i18n/en.json';
import es from '../../../../../../../packages/shared/i18n/es.json';
import { SIGN_IN_GATEWAY, type SignInGateway } from '../state/auth.store';
import { MainLayout } from '../../../shared/main-layout/main-layout';
import { mapControlIcons } from '../../../shared/map-controls/map-icons';
import { RegisterPage } from './register/register.page';
import { SignInPage } from './sign-in/sign-in.page';

vi.mock('maplibre-gl', () => ({
  Map: class {
    setStyle() {}
    remove() {}
  },
}));

const render = (component: Type<unknown>): HTMLElement => {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as MediaQueryList;
  TestBed.configureTestingModule({
    providers: [
      provideIcons({ tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff, tablerPlus, tablerUsers, tablerInfoCircle, tablerMap, tablerWorld, ...mapControlIcons }),
      provideRouter([]),
      provideTranslateService({ fallbackLang: 'en' }),
      {
        provide: SIGN_IN_GATEWAY,
        useValue: {
          signIn: () => of({ accessToken: 'token' }),
          refresh: () => throwError(() => 'invalidRefreshToken'),
          register: () => of(undefined),
        } as unknown as SignInGateway,
      },
    ],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.setTranslation('es', es);
  translate.use('en');
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
};

describe('accessibility of the auth pages', () => {
  it.each([
    ['sign-in', SignInPage],
    ['registration', RegisterPage],
    ['main screen', MainLayout],
  ])('the %s page has no axe violations', async (_name, component) => {
    const element = render(component);

    const results = await axe.run(element);

    expect(results.passes.length).toBeGreaterThan(0);
    expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
  });
});
