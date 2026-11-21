import { copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '..', '..', 'node_modules', 'maplibre-gl', 'dist', 'maplibre-gl-worker.mjs');
const target = join(root, 'public', 'maplibre-gl-worker.mjs');

copyFileSync(source, target);
