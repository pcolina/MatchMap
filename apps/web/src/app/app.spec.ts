import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('shows the app name as the main heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const heading = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(heading?.textContent).toBe('MatchMap');
  });
});
