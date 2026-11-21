import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-layout-footer',
  template: '<footer class="layout-footer"></footer>',
  styleUrl: './layout-footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutFooter {}
