import { trackInputModality } from './input-modality';

describe('trackInputModality', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-input');
  });

  it('marks the page as pointer mode on a pointer press', () => {
    const stop = trackInputModality(document);

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(document.documentElement.getAttribute('data-input')).toBe('pointer');
    stop();
  });

  it('marks the page as keyboard mode on Tab', () => {
    const stop = trackInputModality(document);

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(document.documentElement.getAttribute('data-input')).toBe('keyboard');
    stop();
  });

  it('keeps the current mode for other keys', () => {
    const stop = trackInputModality(document);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

    expect(document.documentElement.getAttribute('data-input')).toBe('keyboard');
    stop();
  });

  it('removes its listeners when stopped', () => {
    const stop = trackInputModality(document);
    stop();

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(document.documentElement.getAttribute('data-input')).toBeNull();
  });
});
