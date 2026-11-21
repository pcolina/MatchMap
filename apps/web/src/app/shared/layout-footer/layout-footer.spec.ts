import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LayoutFooter } from './layout-footer';

describe('LayoutFooter bar', () => {
  const setup = () => {
    TestBed.configureTestingModule({ imports: [LayoutFooter] });
    const fixture = TestBed.createComponent(LayoutFooter);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.layout-footer') as HTMLElement;
  };

  it('uses the accent token, which switches between the light and the dark scheme', () => {
    const footer = setup();

    expect(getComputedStyle(footer).getPropertyValue('background-color')).toBe('var(--mm-color-accent)');
  });

  it('spans the full viewport width at the bottom', () => {
    const footer = setup();

    expect(getComputedStyle(footer).width).toBe('100%');
  });
});
