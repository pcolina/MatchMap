import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerMap } from '@ng-icons/tabler-icons';
import { mapControlIcons } from './map-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { MapBottomControls } from './map-bottom-controls';

const create = (globeActive: boolean) => {
  TestBed.configureTestingModule({
    imports: [MapBottomControls],
    providers: [provideTranslateService({ fallbackLang: 'en' }), provideIcons({ tablerMap, ...mapControlIcons })],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
  const fixture = TestBed.createComponent(MapBottomControls);
  fixture.componentRef.setInput('globeActive', globeActive);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
};

describe('MapBottomControls', () => {
  it('shows only the view toggle, with no attribution button', () => {
    const root = create(false);
    const buttons = Array.from(root.querySelectorAll('button'));

    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual(['Globe view']);
  });

  it('exposes the globe state with aria-pressed', () => {
    const root = create(true);
    const toggle = root.querySelector('button[aria-label="Mercator view"]');

    expect(toggle?.getAttribute('aria-pressed')).toBe('true');
  });

  it('reports the mercator state with aria-pressed false', () => {
    const root = create(false);
    const toggle = root.querySelector('button[aria-label="Globe view"]');

    expect(toggle?.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows the flat map icon when the globe view is active, the destination is mercator', () => {
    const root = create(true);

    expect(root.querySelector('[data-icon]')?.getAttribute('data-icon')).toBe('tablerMap');
  });

  it('shows the globe icon when the mercator view is active, the destination is globe', () => {
    const root = create(false);

    expect(root.querySelector('[data-icon]')?.getAttribute('data-icon')).toBe('globeWorld');
  });
});
