import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  template: '<header class="layout-header"></header>',
  styleUrl: './layout-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeader {}
