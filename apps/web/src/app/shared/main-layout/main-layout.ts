import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  template: '<section class="main-layout"></section>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
