export const buildServeArgs = ({ mock, autoLogin }) => [
  'serve',
  '--port',
  mock ? '4333' : '4300',
  ...(mock ? ['--define=MATCHMAP_MOCKS=true'] : []),
  ...(autoLogin ? ['--define=MATCHMAP_AUTO_LOGIN=true'] : []),
];
