import { Component } from '@angular/core';
import { SafeAreaProvider, SafeAreaView, Text } from '@ng-native/components';

@Component({
  imports: [SafeAreaProvider, SafeAreaView, Text],
  selector: 'app-root',
  template: `
    <safe-area-provider>
      <safe-area-view class="screen">
        <text accessibilityRole="header" class="title">MatchMap</text>
      </safe-area-view>
    </safe-area-provider>
  `,
  styles: `
    :host {
      flex: 1;
    }
    .screen {
      flex: 1;
      align-items: center;
      justify-content: center;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
    }
  `,
})
export class App {}
