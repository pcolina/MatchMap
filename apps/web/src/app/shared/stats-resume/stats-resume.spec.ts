import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { describe, expect, it, vi } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { StatsResume } from './stats-resume';

describe('StatsResume panel', () => {
  const setup = () => {
    TestBed.configureTestingModule({ imports: [StatsResume], providers: [provideTranslateService({ fallbackLang: 'en' })] });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.use('en');
    const fixture = TestBed.createComponent(StatsResume);
    fixture.detectChanges();
    return { fixture, panel: fixture.nativeElement.querySelector('.stats-resume') as HTMLButtonElement };
  };

  it('has a fixed height of 250 px', () => {
    const { panel } = setup();

    expect(getComputedStyle(panel).height).toBe('250px');
  });

  it('uses the accent token, which switches between the light and the dark scheme', () => {
    const { panel } = setup();

    expect(getComputedStyle(panel).getPropertyValue('background-color')).toBe('var(--mm-color-accent)');
  });

  it('clips its content and does not scroll', () => {
    const { panel } = setup();

    expect(getComputedStyle(panel).overflow).toBe('hidden');
  });

  it('is a native button named with the translated label', () => {
    const { panel } = setup();

    expect(panel.tagName).toBe('BUTTON');
    expect(panel.getAttribute('type')).toBe('button');
    expect(panel.getAttribute('aria-label')).toBe('Statistics summary');
  });

  it('emits one press when activated', () => {
    const { fixture, panel } = setup();
    const presses = vi.fn();
    fixture.componentInstance.press.subscribe(presses);

    panel.click();

    expect(presses).toHaveBeenCalledTimes(1);
  });
});
