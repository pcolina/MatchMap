import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  untracked,
  input,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Map as MapLibreMap } from 'maplibre-gl';
import type { MapProjection } from '../../core/map-projection/map-projection.store';
import { ThemeStore } from '../../core/theme/theme.store';
import { globeMinZoom, mercatorBounds, mercatorMinZoom } from './map-view.limits';
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
  readonly projection = input<MapProjection>('mercator');

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  private readonly destroyRef = inject(DestroyRef);
  private readonly theme = inject(ThemeStore);
  private readonly scheme = computed<MapScheme>(() => (this.theme.isDark() ? 'night' : 'day'));
  private map?: MapLibreMap;
  private resizeObserver?: ResizeObserver;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.map?.remove();
    });

    afterNextRender(() => {
      const element = this.container().nativeElement;
      this.map = new MapLibreMap({
        container: element,
        style: buildMapStyle(this.states(), this.scheme(), this.projection()),
        attributionControl: false,
        ...this.limits(this.projection(), element.clientWidth),
      });
      this.resizeObserver = new ResizeObserver((entries) => {
        if (untracked(this.projection) === 'globe') {
          this.map?.setMinZoom(globeMinZoom(entries[0].contentRect.width));
        }
      });
      this.resizeObserver.observe(element);
    });

    effect(() => {
      const projection = this.projection();
      const width = untracked(() => this.container().nativeElement.clientWidth);
      const limits = this.limits(projection, width);
      this.map?.setMinZoom(limits.minZoom);
      this.map?.setMaxBounds(limits.maxBounds ?? null);
    });

    effect(() => {
      const style = buildMapStyle(this.states(), this.scheme(), this.projection());
      this.map?.setStyle(style);
    });
  }

  private limits(projection: MapProjection, width: number): { minZoom: number; maxBounds?: [[number, number], [number, number]] } {
    return projection === 'globe' ? { minZoom: globeMinZoom(width) } : { minZoom: mercatorMinZoom, maxBounds: mercatorBounds };
  }
}
