export const mercatorMinZoom = 3;

export const mercatorBounds: [[number, number], [number, number]] = [
  [-180, -60],
  [180, 85],
];

export const globeMinZoom = (width: number): number => {
  const usable = width - 8;
  return usable > 0 ? Math.max(0, Math.log2((usable * Math.PI) / 512)) : 0;
};
