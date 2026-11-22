import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Map as MapLibreMap } from 'maplibre-gl';
import { MapScheme, MapState, buildMapStyle } from './map-view.style';

@Component({
  selector: 'app-map-view',
  imports: [TranslatePipe],
  template: `<div #container class="map-view" role="img" [attr.aria-label]="'map.world.label' | translate"></div>`,
  styleUrl: './map-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapView {
  readonly states = input<Record<string, MapState>>({});

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  private readonly destroyRef = inject(DestroyRef);
  private readonly darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly dark = signal(this.darkQuery.matches);
  private readonly scheme = computed<MapScheme>(() => (this.dark() ? 'night' : 'day'));
  private map?: MapLibreMap;

  constructor() {
    const onSchemeChange = (event: { matches: boolean }) => this.dark.set(event.matches);
    this.darkQuery.addEventListener('change', onSchemeChange);
    this.destroyRef.onDestroy(() => {
      this.darkQuery.removeEventListener('change', onSchemeChange);
      this.map?.remove();
    });

    afterNextRender(() => {
      this.map = new MapLibreMap({
        container: this.container().nativeElement,
        style: buildMapStyle(this.states(), this.scheme()),
        attributionControl: false,
      });
    });

    effect(() => {
      const style = buildMapStyle(this.states(), this.scheme());
      this.map?.setStyle(style);
    });
  }
}
