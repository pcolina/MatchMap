import { Component } from '@angular/core';
import { SafeAreaProvider, SafeAreaView } from '@ng-native/components';
import { NativeStackOutlet } from '@ng-native/router';

@Component({
  selector: 'app-root',
  imports: [NativeStackOutlet, SafeAreaProvider, SafeAreaView],
  template: `
    <safe-area-provider>
      <safe-area-view class="root">
        <native-stack-outlet />
      </safe-area-view>
    </safe-area-provider>
  `,
  styles: `
    :host {
      flex: 1;
    }
    .root {
      flex: 1;
    }
  `,
})
export class App {}
