import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerLanguage } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../../../../../../packages/shared/i18n/en.json';
import { LanguageSwitcherComponent } from './language-switcher';

const createSwitcher = () => {
  const fixture = TestBed.createComponent(LanguageSwitcherComponent);
  fixture.detectChanges();
  return fixture;
};

describe('LanguageSwitcherComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideIcons({ tablerLanguage }), provideTranslateService({ fallbackLang: 'en' })],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.use('en');
  });

  it('is a circular button with the languages icon', () => {
    const fixture = createSwitcher();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('button');

    expect(button).not.toBeNull();
    expect(getComputedStyle(button!).getPropertyValue('border-radius')).toBe('var(--mm-radius-pill)');
    expect(getComputedStyle(button!).getPropertyValue('width')).toBe('var(--mm-size-touch-target-min)');
    expect(getComputedStyle(button!).getPropertyValue('height')).toBe('var(--mm-size-touch-target-min)');
    expect(fixture.nativeElement.querySelector('ng-icon')?.getAttribute('name')).toBe('tablerLanguage');
  });

  it('has the card elevation shadow', () => {
    const fixture = createSwitcher();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('button');

    expect(getComputedStyle(button!).getPropertyValue('box-shadow')).toBe('var(--mm-elevation-card)');
  });

  it('has the translated accessible name', () => {
    const fixture = createSwitcher();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');

    expect(button?.getAttribute('aria-label')).toBe('languages');
  });

  it('does nothing when activated', () => {
    const fixture = createSwitcher();
    const before = (fixture.nativeElement as HTMLElement).innerHTML;

    (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('button')?.click();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).innerHTML).toBe(before);
  });
});
