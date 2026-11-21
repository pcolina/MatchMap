import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LayoutHeader } from './layout-header';

describe('LayoutHeader bar', () => {
  const setup = () => {
    TestBed.configureTestingModule({ imports: [LayoutHeader] });
    const fixture = TestBed.createComponent(LayoutHeader);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.layout-header') as HTMLElement;
  };

  it('uses the accent token, which switches between the light and the dark scheme', () => {
    const header = setup();

    expect(getComputedStyle(header).getPropertyValue('background-color')).toBe('var(--mm-color-accent)');
  });

  it('spans the full viewport width', () => {
    const header = setup();

    expect(getComputedStyle(header).width).toBe('100%');
  });
});
