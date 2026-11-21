const usage = 'Usage: pnpm web [mock]';

export const parseStartArgs = (argv) => {
  if (argv.length === 0) {
    return { mock: false };
  }
  if (argv.length === 1 && argv[0] === 'mock') {
    return { mock: true };
  }
  throw new Error(usage);
};
