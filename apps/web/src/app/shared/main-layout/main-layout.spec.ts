import { TestBed } from '@angular/core/testing';
import en from '../../../../../../packages/shared/i18n/en.json';
import { mapControlIcons } from '../map-controls/map-icons';
import { provideIcons } from '@ng-icons/core';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MapView } from '../map-view/map-view';
import { of, throwError } from 'rxjs';
import { AuthStore, SIGN_IN_GATEWAY } from '../../features/auth/state/auth.store';
import { ACCOUNT_GATEWAY } from '../../features/account/state/account.store';
import { tablerInfoCircle, tablerLanguage, tablerLogout, tablerMap, tablerPlus, tablerSunMoon, tablerUser, tablerUsers, tablerX } from '@ng-icons/tabler-icons';
import { MainLayout } from './main-layout';

vi.mock('maplibre-gl', () => ({
  Map: class {
    setStyle() {}
    setMinZoom() {}
    on() {}
    project() {
      return { x: 0, y: 0 };
    }
    remove() {}
  },
}));

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');

describe('MainLayout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: ACCOUNT_GATEWAY, useValue: { me: () => of({ username: 'ana', email: 'ana@example.test' }) } },
        {
          provide: SIGN_IN_GATEWAY,
          useValue: { signIn: () => of({ accessToken: 'token' }), refresh: () => throwError(() => 'invalidRefreshToken'), logout: () => of(undefined), register: () => of(undefined) },
        },
        provideIcons({
          tablerInfoCircle,
          tablerLanguage,
          tablerLogout,
          tablerMap,
          tablerPlus,
          tablerSunMoon,
          tablerUser,
          tablerUsers,
          tablerX,
          ...mapControlIcons,
        }),
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.use('en');
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('keeps the focus order: top controls, map, stats panel, bottom controls', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const section = (fixture.nativeElement as HTMLElement).querySelector('section.main-layout');
    expect(Array.from(section?.children ?? []).map((child) => child.tagName.toLowerCase())).toEqual([
      'app-layout-header',
      'div',
      'app-stats-resume',
      'app-layout-footer',
      'app-account-sheet',
      'app-about-dialog',
    ]);
  });

  it('opens the account sheet when the account button is pressed', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const accountButton = root.querySelector('[data-column="top-right"] button') as HTMLButtonElement;
    accountButton.click();
    fixture.detectChanges();

    expect(root.querySelector('app-account-sheet dialog')?.hasAttribute('open')).toBe(true);
    expect(accountButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('shows the username and the email of the signed-in user in the account sheet', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('app-account-sheet .name')?.textContent?.trim()).toBe('ana');
    expect(root.querySelector('app-account-sheet [data-testid="email"]')?.textContent?.trim()).toBe('ana@example.test');
  });

  it('closes the account sheet when it emits closed', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    (root.querySelector('[data-column="top-right"] button') as HTMLButtonElement).click();
    fixture.detectChanges();
    (root.querySelector('app-account-sheet dialog') as HTMLDialogElement).dispatchEvent(new Event('cancel', { cancelable: true }));
    fixture.detectChanges();

    expect(root.querySelector('app-account-sheet dialog')?.hasAttribute('open')).toBe(false);
    expect((root.querySelector('[data-column="top-right"] button') as HTMLButtonElement).getAttribute('aria-expanded')).toBe('false');
  });

  it('places the top controls before the map inside the map area', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const mapArea = (fixture.nativeElement as HTMLElement).querySelector('.map-area');
    expect(Array.from(mapArea?.children ?? []).map((child) => child.tagName.toLowerCase())).toEqual([
      'app-map-top-controls',
      'app-map-view',
      'app-map-bottom-controls',
    ]);
  });

  it('makes the map area a positioning context for the top controls', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/\.map-area\s*\{[^}]*position:\s*relative;/);
  });

  it('defines the stats panel height once and places the bottom controls inside the map area', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/--stats-height:\s*250px;/);
    expect(css).toMatch(/\.map-area\s*>\s*app-map-bottom-controls\s*\{[^}]*bottom:\s*calc\(16px\s*\+\s*env\(safe-area-inset-bottom\)\)/);
  });

  it('shows the projection toggle on laptop widths', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).not.toMatch(/app-map-bottom-controls\s*\{\s*display:\s*none;/);
  });

  it('gives the layout the full viewport height', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/\.main-layout\s*\{[^}]*height:\s*100dvh;/);
  });

  it('gives the map area the leftover height, so the panel is never covered', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/app-map-view\s*\{[^}]*flex:\s*1/);
  });

  it('shows the 250 px panel only in the phone layout, up to 600 px', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/app-stats-resume\s*\{[^}]*display:\s*block;\s*flex:\s*0 0 var\(--stats-height\)/);
    expect(css).toMatch(/app-layout-header,\s*app-layout-footer\s*\{[^}]*display:\s*none/);
  });

  it('starts the laptop layout at 601 px', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/@media\s*\(min-width:\s*601px\)/);
  });

  it('gives the map area half the viewport height in the laptop layout', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/@media\s*\(min-width:\s*601px\)\s*\{[\s\S]*\.map-area\s*\{[^}]*flex:\s*0 0 50%/);
  });

  it('gives the stats panel the remaining height in the laptop layout, without scroll', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/@media\s*\(min-width:\s*601px\)\s*\{[\s\S]*app-stats-resume\s*\{[^}]*flex:\s*1/);
    expect(css).toMatch(/@media\s*\(min-width:\s*601px\)\s*\{[\s\S]*app-stats-resume\s*\{[^}]*overflow:\s*hidden/);
  });

  it('paints the map area with the accent colour in globe mode', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/\.map-area\.globe\s*\{[^}]*background-color:\s*var\(--mm-color-accent\);/);
  });

  it('marks the map area as globe when the globe projection is on', async () => {
    localStorage.setItem('matchmap.mapProjection', 'globe');
    try {
      const fixture = TestBed.createComponent(MainLayout);
      fixture.detectChanges();
      await fixture.whenStable();

      expect((fixture.nativeElement as HTMLElement).querySelector('.map-area')?.classList.contains('globe')).toBe(true);
    } finally {
      localStorage.removeItem('matchmap.mapProjection');
    }
  });

  it('keeps the phone panel above the bottom safe-area inset', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/env\(safe-area-inset-bottom\)/);
  });

  const press = (root: HTMLElement, name: string) => {
    const row = Array.from(root.querySelectorAll<HTMLButtonElement>('app-account-sheet button[data-row]')).find((button) => button.textContent?.trim() === name);
    (row as HTMLButtonElement).click();
  };

  const openAccountSheet = (fixture: { detectChanges(): void; nativeElement: unknown }) => {
    ((fixture.nativeElement as HTMLElement).querySelector('[data-column="top-right"] button') as HTMLButtonElement).click();
    fixture.detectChanges();
  };

  it('opens the about dialog from the about row and closes it again', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    openAccountSheet(fixture);

    press(root, 'About matchMap');
    fixture.detectChanges();
    expect(root.querySelector('app-about-dialog dialog')?.hasAttribute('open')).toBe(true);

    (root.querySelector('app-about-dialog dialog') as HTMLDialogElement).dispatchEvent(new Event('cancel', { cancelable: true }));
    fixture.detectChanges();
    expect(root.querySelector('app-about-dialog dialog')?.hasAttribute('open')).toBe(false);
  });

  it('the day or night row switches the whole app to dark mode', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();
    openAccountSheet(fixture);

    press(fixture.nativeElement as HTMLElement, 'Light or dark mode');
    fixture.detectChanges();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('sign out clears the session and goes to the sign-in page', async () => {
    TestBed.inject(AuthStore).setAccessToken('token');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();
    openAccountSheet(fixture);

    press(fixture.nativeElement as HTMLElement, 'Sign out');
    fixture.detectChanges();

    expect(TestBed.inject(AuthStore).accessToken()).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('the view toggle switches the map between Mercator and the globe, and back', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const toggle = () => root.querySelector('app-map-bottom-controls button') as HTMLButtonElement;
    const mapProjection = () => fixture.debugElement.query(By.directive(MapView)).componentInstance.projection();

    expect(toggle().getAttribute('aria-pressed')).toBe('false');
    expect(mapProjection()).toBe('mercator');

    toggle().click();
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-pressed')).toBe('true');
    expect(toggle().getAttribute('aria-label')).toBe('Mercator view');
    expect(mapProjection()).toBe('globe');

    toggle().click();
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
    expect(mapProjection()).toBe('mercator');
  });


  it('shows the red dot and the pending count on the avatar when notifications are pending', async () => {
    localStorage.setItem('matchmap.notifications.pending', '2');
    try {
      const fixture = TestBed.createComponent(MainLayout);
      fixture.detectChanges();
      await fixture.whenStable();

      const root = fixture.nativeElement as HTMLElement;
      const accountButton = root.querySelector('[data-column="top-right"] button') as HTMLButtonElement;

      expect(root.querySelector('[data-testid="notification-dot"]')).not.toBeNull();
      expect(accountButton.getAttribute('aria-label')).toBe('Account, 2 unread notifications');
    } finally {
      localStorage.removeItem('matchmap.notifications.pending');
    }
  });

  it('shows the Notifications row second in the account sheet', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    (root.querySelector('[data-column="top-right"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    const rows = Array.from(root.querySelectorAll('app-account-sheet button[data-row]')).map((row) => row.textContent?.trim());
    expect(rows[1]).toBe('Notifications');
  });

  it('shows the pending count as a badge in the notifications row of the sheet', async () => {
    localStorage.setItem('matchmap.notifications.pending', '2');
    try {
      const fixture = TestBed.createComponent(MainLayout);
      fixture.detectChanges();
      await fixture.whenStable();

      const root = fixture.nativeElement as HTMLElement;
      (root.querySelector('[data-column="top-right"] button') as HTMLButtonElement).click();
      fixture.detectChanges();

      const row = root.querySelectorAll<HTMLButtonElement>('app-account-sheet button[data-row]')[1];
      expect(row.querySelector('[data-testid="notification-count"]')?.textContent?.trim()).toBe('2');
    } finally {
      localStorage.removeItem('matchmap.notifications.pending');
    }
  });

  it('shows the dark-background logo in the header when the dark scheme is saved', async () => {
    localStorage.setItem('matchmap.theme', 'dark');
    try {
      const fixture = TestBed.createComponent(MainLayout);
      fixture.detectChanges();
      await fixture.whenStable();

      const logo = (fixture.nativeElement as HTMLElement).querySelector('.layout-header img') as HTMLImageElement;
      expect(logo.getAttribute('src')).toBe('/brand/horizontal-on-dark.svg');
    } finally {
      localStorage.removeItem('matchmap.theme');
    }
  });

  it('shows the light logo in the header when the light scheme is saved', async () => {
    localStorage.setItem('matchmap.theme', 'light');
    try {
      const fixture = TestBed.createComponent(MainLayout);
      fixture.detectChanges();
      await fixture.whenStable();

      const logo = (fixture.nativeElement as HTMLElement).querySelector('.layout-header img') as HTMLImageElement;
      expect(logo.getAttribute('src')).toBe('/brand/horizontal-on-light.svg');
    } finally {
      localStorage.removeItem('matchmap.theme');
    }
  });

  it('opens the account sheet from the profile button in the header', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    (root.querySelector('.layout-header app-account-button button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(root.querySelector('app-account-sheet dialog')?.hasAttribute('open')).toBe(true);
  });

});

describe('map view page size', () => {
  it('fills the layout height with the host and the map container', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'map-view', 'map-view.css'), 'utf8');

    expect(css).toMatch(/:host\s*\{[^}]*height:\s*100%;/);
    expect(css).toMatch(/\.map-view\s*\{[^}]*height:\s*100%;/);
  });
});
