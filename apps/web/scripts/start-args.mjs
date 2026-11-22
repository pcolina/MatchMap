const usage = 'Usage: pnpm web [mock [-l]]';

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
