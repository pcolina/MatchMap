import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutFooter } from '../layout-footer/layout-footer';
import { LayoutHeader } from '../layout-header/layout-header';
import { MapBottomControls } from '../map-controls/map-bottom-controls';
import { MapTopControls } from '../map-controls/map-top-controls';
import { MapView } from '../map-view/map-view';
import { StatsResume } from '../stats-resume/stats-resume';

@Component({
  selector: 'app-main-layout',
  imports: [LayoutHeader, MapView, MapTopControls, MapBottomControls, StatsResume, LayoutFooter],
  template: `<section class="main-layout">
    <app-layout-header />
    <div class="map-area">
      <app-map-top-controls />
      <app-map-view />
    </div>
    <app-stats-resume />
    <app-map-bottom-controls />
    <app-layout-footer />
  </section>`,
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
