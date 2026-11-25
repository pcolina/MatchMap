import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerPlus, tablerUsers } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { SideMenu } from './side-menu';

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');

const readCss = () => readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'side-menu', 'side-menu.css'), 'utf8');

const create = () => {
  TestBed.configureTestingModule({
    imports: [SideMenu],
    providers: [provideTranslateService({ fallbackLang: 'en' }), provideIcons({ tablerPlus, tablerUsers })],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
  const fixture = TestBed.createComponent(SideMenu);
  fixture.detectChanges();
  return fixture;
};

describe('SideMenu', () => {
  it('is a navigation landmark named from the translations', () => {
    const fixture = create();
    const nav = (fixture.nativeElement as HTMLElement).querySelector('nav');

    expect(nav?.getAttribute('aria-label')).toBe('Main menu');
  });

  it('holds the add place and friends buttons in that order', () => {
    const fixture = create();
    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('nav button'));

    expect(buttons.map((button) => button.textContent?.trim())).toEqual(['Add place', 'Friends']);
  });

  it('ends with a skip link to the main content', () => {
    const fixture = create();
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('nav a'));

    expect(links.map((link) => link.textContent?.trim())).toEqual(['Skip menu']);
    expect(links[0].getAttribute('href')).toBe('#main-content');
    expect(links[0].parentElement?.lastElementChild).toBe(links[0]);
  });

  it('emits addPlacePressed when add place is pressed', () => {
    const fixture = create();
    const emitted: unknown[] = [];
    fixture.componentInstance.addPlacePressed.subscribe((value) => emitted.push(value));
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('nav button')?.click();

    expect(emitted).toHaveLength(1);
  });

  it('emits friendsPressed when friends is pressed', () => {
    const fixture = create();
    const emitted: unknown[] = [];
    fixture.componentInstance.friendsPressed.subscribe((value) => emitted.push(value));
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('nav button')[1]?.click();

    expect(emitted).toHaveLength(1);
  });

  it('colours the add place icon with the accent and the friends icon with the secondary text colour', () => {
    const css = readCss();

    expect(css).toMatch(/\.add-place\s+ng-icon\s*\{[^}]*color:\s*var\(--mm-color-accent\);/);
    expect(css).toMatch(/\.friends\s+ng-icon\s*\{[^}]*color:\s*var\(--mm-color-textSecondary\);/);
  });
});
