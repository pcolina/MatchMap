import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const usage = 'Usage: pnpm mobile [mock]';

export const parseStartArgs = (argv) => {
  if (argv.length === 0) {
    return { mock: false };
  }
  if (argv.length === 1 && argv[0] === 'mock') {
    return { mock: true };
  }
  throw new Error(usage);
};

export const buildExpoEnv = ({ mock }) => (mock ? { EXPO_PUBLIC_MATCHMAP_MOCKS: 'true' } : {});

const main = () => {
  let options;
  try {
    options = parseStartArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  const child = spawn('expo', ['start'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...buildExpoEnv(options) },
  });
  child.on('exit', (code) => process.exit(code ?? 1));
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
