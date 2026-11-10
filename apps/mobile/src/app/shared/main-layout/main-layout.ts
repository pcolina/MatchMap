import { ChangeDetectionStrategy, Component } from '@angular/core';
import { View } from '@ng-native/components';

@Component({
  selector: 'app-main-layout',
  imports: [View],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<view class="layout" />',
  styles: `
    :host {
      flex: 1;
    }
    .layout {
      flex: 1;
    }
  `,
})
export class MainLayout {}
