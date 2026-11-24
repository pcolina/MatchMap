import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { appVersion } from '../../core/app-version';
import { MapProjectionStore } from '../../core/map-projection/map-projection.store';
import { NotificationsStore } from '../../core/notifications/notifications.store';
import { ThemeStore } from '../../core/theme/theme.store';
import { AuthStore } from '../../features/auth/state/auth.store';
import { AccountStore } from '../../features/account/state/account.store';
import { AboutDialog } from '../about-dialog/about-dialog';
import { AccountSheet } from '../account-sheet/account-sheet';
import { LayoutFooter } from '../layout-footer/layout-footer';
import { LayoutHeader } from '../layout-header/layout-header';
import { MapBottomControls } from '../map-controls/map-bottom-controls';
import { MapTopControls } from '../map-controls/map-top-controls';
import { MapView } from '../map-view/map-view';
import { StatsResume } from '../stats-resume/stats-resume';

@Component({
  selector: 'app-main-layout',
  imports: [LayoutHeader, MapView, MapTopControls, MapBottomControls, StatsResume, LayoutFooter, AccountSheet, AboutDialog],
  template: `<section class="main-layout">
    <app-layout-header [darkMode]="theme.isDark()" [pendingCount]="notifications.count()" (accountPressed)="accountOpen.set(true)" />
    <div class="map-area" [class.globe]="projection.globe()">
      <app-map-top-controls [accountOpen]="accountOpen()" [pendingCount]="notifications.count()" (accountPressed)="accountOpen.set(true)" />
      <app-map-view [projection]="projection.projection()" />
    </div>
    <app-stats-resume />
    <app-map-bottom-controls [globeActive]="projection.globe()" (pressed)="projection.toggle()" />
    <app-layout-footer />
    <app-account-sheet
      [open]="accountOpen()"
      [displayName]="account.username()"
      [email]="account.email()"
      [darkMode]="theme.isDark()"
      [pendingCount]="notifications.count()"
      (closed)="accountOpen.set(false)"
      (signOutPressed)="auth.signOutRemote()"
      (themeToggled)="theme.toggle()"
      (aboutPressed)="aboutOpen.set(true)"
    />
    <app-about-dialog [open]="aboutOpen()" [version]="version" (closed)="aboutOpen.set(false)" />
  </section>`,
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  readonly accountOpen = signal(false);
  readonly aboutOpen = signal(false);
  protected readonly account = inject(AccountStore);
  protected readonly auth = inject(AuthStore);
  protected readonly theme = inject(ThemeStore);
  protected readonly projection = inject(MapProjectionStore);
  protected readonly notifications = inject(NotificationsStore);
  protected readonly version = appVersion;

  constructor() {
    this.account.load();
  }
}
