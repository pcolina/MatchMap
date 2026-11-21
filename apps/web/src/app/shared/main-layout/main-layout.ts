import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutFooter } from '../layout-footer/layout-footer';
import { LayoutHeader } from '../layout-header/layout-header';
import { MapView } from '../map-view/map-view';
import { StatsResume } from '../stats-resume/stats-resume';

@Component({
  selector: 'app-main-layout',
  imports: [LayoutHeader, MapView, StatsResume, LayoutFooter],
  template: '<section class="main-layout"><app-layout-header /><app-map-view /><app-stats-resume /><app-layout-footer /></section>',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
