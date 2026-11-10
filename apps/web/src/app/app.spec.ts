import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('hosts the routed page without a heading of its own', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('router-outlet')).not.toBeNull();
    expect(element.querySelector('h1')).toBeNull();
  });
});
