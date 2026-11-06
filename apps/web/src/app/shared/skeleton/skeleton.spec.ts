import { TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton';

const stubReducedMotion = (reduce: boolean): void => {
  window.matchMedia = (query: string) =>
    ({
      matches: reduce && query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList;
};

const createSkeleton = (shapes: readonly ('field' | 'button')[]) => {
  const fixture = TestBed.createComponent(SkeletonComponent);
  fixture.componentRef.setInput('shapes', shapes);
  fixture.detectChanges();
  return fixture;
};

const blocksOf = (element: HTMLElement): HTMLElement[] =>
  Array.from(element.querySelectorAll<HTMLElement>('[data-shape]'));

describe('SkeletonComponent', () => {
  beforeEach(() => stubReducedMotion(false));

  it('renders one block for each shape, in the given order', () => {
    const fixture = createSkeleton(['field', 'field', 'button']);
    expect(blocksOf(fixture.nativeElement).map((block) => block.dataset['shape'])).toEqual([
      'field',
      'field',
      'button',
    ]);
  });

  it('is hidden from assistive technology', () => {
    const fixture = createSkeleton([]);
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
  });

  it('is coloured with the border token', () => {
    const fixture = createSkeleton(['field']);
    const [block] = blocksOf(fixture.nativeElement);
    expect(getComputedStyle(block).getPropertyValue('background-color')).toBe('var(--mm-color-border)');
  });

  it('pulses for the base motion duration', () => {
    const fixture = createSkeleton(['field']);
    const [block] = blocksOf(fixture.nativeElement);
    expect(getComputedStyle(block).getPropertyValue('animation')).toContain('var(--mm-motion-base)');
  });

  it('does not pulse when the system asks to reduce motion', () => {
    stubReducedMotion(true);
    const fixture = createSkeleton(['field']);
    const [block] = blocksOf(fixture.nativeElement);
    expect(block.classList).toContain('skeleton-block--static');
    expect(getComputedStyle(block).getPropertyValue('animation-name')).toBe('none');
  });
});
