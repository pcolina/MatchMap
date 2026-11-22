import { ApplicationRef, Type } from '@angular/core';
import { mapControlIcons } from '../../../shared/map-controls/map-icons';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerEye, tablerEyeOff, tablerInfoCircle, tablerLanguage, tablerLock, tablerLogout, tablerMap, tablerPlus, tablerSunMoon, tablerUser, tablerUsers, tablerWorld, tablerX } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import axe from 'axe-core';
import { of, throwError } from 'rxjs';
import en from '../../../../../../../packages/shared/i18n/en.json';
import es from '../../../../../../../packages/shared/i18n/es.json';
import { SIGN_IN_GATEWAY, type SignInGateway } from '../state/auth.store';
import { MainLayout } from '../../../shared/main-layout/main-layout';
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
      provideIcons({ tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff, tablerPlus, tablerUsers, tablerMap, tablerWorld, tablerInfoCircle, tablerLogout, tablerSunMoon, tablerX, ...mapControlIcons }),
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

  it('the main screen with the account sheet open has no axe violations', async () => {
    const element = render(MainLayout);
    (element.querySelector('[data-column="top-right"] button') as HTMLButtonElement).click();
    TestBed.inject(ApplicationRef).tick();

    const results = await axe.run(element);

    expect(element.querySelector('app-account-sheet dialog')?.hasAttribute('open')).toBe(true);
    expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
  });

  it('the main screen with the about dialog open has no axe violations', async () => {
    const element = render(MainLayout);
    (element.querySelector('[data-column="top-right"] button') as HTMLButtonElement).click();
    TestBed.inject(ApplicationRef).tick();
    (Array.from(element.querySelectorAll<HTMLButtonElement>('app-account-sheet button[data-row]')).find(
      (button) => button.textContent?.trim() === 'About matchMap',
    ) as HTMLButtonElement).click();
    TestBed.inject(ApplicationRef).tick();

    const results = await axe.run(element);

    expect(element.querySelector('app-about-dialog dialog')?.hasAttribute('open')).toBe(true);
    expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
  });
});
