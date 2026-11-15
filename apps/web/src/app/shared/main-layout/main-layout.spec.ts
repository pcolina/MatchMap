import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
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
    TestBed.configureTestingModule({ providers: [provideTranslateService({ fallbackLang: 'en' })] });
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the world map as its only content', async () => {
    const fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    const section = (fixture.nativeElement as HTMLElement).querySelector('section.main-layout');
    expect(section).not.toBeNull();
    expect(Array.from(section?.children ?? []).map((child) => child.tagName.toLowerCase())).toEqual(['app-map-view']);
  });

  it('gives the layout the full viewport height', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'main-layout', 'main-layout.css'), 'utf8');

    expect(css).toMatch(/\.main-layout\s*\{[^}]*height:\s*100dvh;/);
  });
});

describe('map view page size', () => {
  it('fills the layout height with the host and the map container', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'map-view', 'map-view.css'), 'utf8');

    expect(css).toMatch(/:host\s*\{[^}]*height:\s*100%;/);
    expect(css).toMatch(/\.map-view\s*\{[^}]*height:\s*100%;/);
  });
});
