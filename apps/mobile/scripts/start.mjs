import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const usage = 'Usage: pnpm mobile [mock [-l]]';

export const parseStartArgs = (argv) => {
  if (argv.length === 0) {
    return { mock: false, autoLogin: false };
  }
  if (argv.length === 1 && argv[0] === 'mock') {
    return { mock: true, autoLogin: false };
  }
  if (argv.length === 2 && argv[0] === 'mock' && argv[1] === '-l') {
    return { mock: true, autoLogin: true };
  }
  throw new Error(usage);
};

export const buildExpoEnv = ({ mock, autoLogin }) => ({
  ...(mock ? { EXPO_PUBLIC_MATCHMAP_MOCKS: 'true' } : {}),
  ...(autoLogin ? { EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN: 'true' } : {}),
});

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
