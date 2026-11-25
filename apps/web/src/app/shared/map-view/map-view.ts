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
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Map as MapLibreMap } from 'maplibre-gl';
import type { MapProjection } from '../../core/map-projection/map-projection.store';
import { ThemeStore } from '../../core/theme/theme.store';
import { MapScheme, MapState, buildMapStyle } from './map-view.style';

const mercatorOptions = {
  center: [0, 42] as [number, number],
  minZoom: -2,
  zoom: -2,
  renderWorldCopies: false,
};

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
  private correcting = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.map?.remove();
    });

    afterNextRender(() => {
      this.map = new MapLibreMap({
        container: this.container().nativeElement,
        style: buildMapStyle(this.states(), this.scheme(), this.projection()),
        attributionControl: false,
        ...(this.projection() === 'mercator' ? mercatorOptions : {}),
      });
      this.map.on('moveend', () => this.keepAboveAntarctica());
      this.map.on('movestart', (event: { originalEvent?: unknown }) => {
        if (event.originalEvent) {
          this.correcting = false;
        }
      });
      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => this.applyMinZoom());
        resizeObserver.observe(this.container().nativeElement);
        this.destroyRef.onDestroy(() => resizeObserver.disconnect());
      }
    });

    effect(() => {
      const style = buildMapStyle(this.states(), this.scheme(), this.projection());
      this.map?.setStyle(style);
      this.applyMinZoom();
    });
  }

  private applyMinZoom(): void {
    if (!this.map) {
      return;
    }
    if (this.projection() !== 'globe') {
      this.map.setMinZoom(-2);
      return;
    }
    const { clientWidth, clientHeight } = this.container().nativeElement;
    const side = Math.min(clientWidth, clientHeight);
    this.map.setMinZoom(Math.max(0, Math.log2((Math.max(side - 8, 1) * Math.PI) / 512)));
  }

  private keepAboveAntarctica(): void {
    if (this.correcting) {
      this.correcting = false;
      return;
    }
    if (!this.map || this.projection() !== 'mercator') {
      return;
    }
    const south = this.map.getBounds().getSouth();
    const shift = -60 - south;
    if (shift < 0.05) {
      return;
    }
    const center = this.map.getCenter();
    this.correcting = true;
    this.map.easeTo({ center: [center.lng, center.lat + shift], duration: 300 });
  }
}
