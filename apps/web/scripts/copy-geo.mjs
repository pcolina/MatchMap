import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const copyGeo = (source, target) => {
  mkdirSync(target, { recursive: true });
  const files = readdirSync(source).filter((name) => name.endsWith('.json')).sort();
  for (const name of files) {
    copyFileSync(join(source, name), join(target, name));
  }
  return files;
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  copyGeo(join(root, '..', '..', 'packages', 'shared', 'geo'), join(root, 'public', 'geo'));
}
