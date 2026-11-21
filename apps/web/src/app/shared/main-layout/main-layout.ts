import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MapView } from '../map-view/map-view';
import { StatsResume } from '../stats-resume/stats-resume';

@Component({
  selector: 'app-main-layout',
  imports: [MapView, StatsResume],
  template: '<section class="main-layout"><app-map-view /><app-stats-resume /></section>',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
