import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { resolveLanguage, setupTranslations } from './language';

describe('resolveLanguage', () => {
  it('uses Spanish for any Spanish browser language', () => {
    expect(resolveLanguage('es')).toBe('es');
    expect(resolveLanguage('es-MX')).toBe('es');
  });

  it('uses English for English browser languages', () => {
    expect(resolveLanguage('en')).toBe('en');
    expect(resolveLanguage('en-GB')).toBe('en');
  });

  it('falls back to English for any other language or none', () => {
    expect(resolveLanguage('fr-FR')).toBe('en');
    expect(resolveLanguage(undefined)).toBe('en');
  });
});

describe('setupTranslations', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService({ fallbackLang: 'en' })] });
  });

  it('activates the browser language when it is supported', () => {
    const translate = TestBed.inject(TranslateService);

    setupTranslations(translate, 'es-ES');

    expect(translate.currentLang()).toBe('es');
    expect(translate.instant('login.signIn.submit')).toBe('Iniciar sesión');
  });

  it('activates English for an unsupported browser language', () => {
    const translate = TestBed.inject(TranslateService);

    setupTranslations(translate, 'fr-FR');

    expect(translate.currentLang()).toBe('en');
    expect(translate.instant('login.signIn.submit')).toBe('Sign in');
  });
});
