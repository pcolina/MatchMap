import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';
import { StatsResume } from './stats-resume';

describe('StatsResume panel', () => {
  const setup = () => {
    TestBed.configureTestingModule({ imports: [StatsResume], providers: [provideTranslateService({ fallbackLang: 'en' })] });
    const fixture = TestBed.createComponent(StatsResume);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.stats-resume') as HTMLElement;
  };

  it('has a fixed height of 250 px', () => {
    const panel = setup();

    expect(getComputedStyle(panel).height).toBe('250px');
  });

  it('uses the accent token, which switches between the light and the dark scheme', () => {
    const panel = setup();

    expect(getComputedStyle(panel).getPropertyValue('background-color')).toBe('var(--mm-color-accent)');
  });
});
