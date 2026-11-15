import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MapView } from '../map-view/map-view';

@Component({
  selector: 'app-main-layout',
  imports: [MapView],
  template: '<section class="main-layout"><app-map-view /></section>',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
