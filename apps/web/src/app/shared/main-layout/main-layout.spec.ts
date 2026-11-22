import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { provideTranslateService } from '@ngx-translate/core';
import { tablerInfoCircle, tablerMap, tablerPlus, tablerUser, tablerUsers,  } from '@ng-icons/tabler-icons';
import { mapControlIcons } from '../map-controls/map-icons';
import { MainLayout } from './main-layout';

vi.mock('maplibre-gl', () => ({
  Map: class {
    setStyle() {}
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
        provideIcons({ tablerInfoCircle, tablerMap, tablerPlus, tablerUser, tablerUsers, ...mapControlIcons }),
      ],
    });
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
      'app-map-bottom-controls',
      'app-layout-footer',
    ]);
  });

  it('places the top controls before the map inside the map area', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const mapArea = (fixture.nativeElement as HTMLElement).querySelector('.map-area');
    expect(Array.from(mapArea?.children ?? []).map((child) => child.tagName.toLowerCase())).toEqual([
      'app-map-top-controls',
      'app-map-view',
    ]);
  });

  it('makes the map area a positioning context for the top controls', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/\.map-area\s*\{[^}]*position:\s*relative;/);
  });

  it('defines the stats panel height once and uses it to place the bottom controls', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/--stats-height:\s*250px;/);
    expect(css).toMatch(/app-map-bottom-controls\s*\{[^}]*bottom:\s*calc\(var\(--stats-height\)\s*\+\s*16px\s*\+\s*env\(safe-area-inset-bottom\)\)/);
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

  it('keeps the phone panel above the bottom safe-area inset', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/env\(safe-area-inset-bottom\)/);
  });
});

describe('map view page size', () => {
  it('fills the layout height with the host and the map container', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'map-view', 'map-view.css'), 'utf8');

    expect(css).toMatch(/:host\s*\{[^}]*height:\s*100%;/);
    expect(css).toMatch(/\.map-view\s*\{[^}]*height:\s*100%;/);
  });
});
