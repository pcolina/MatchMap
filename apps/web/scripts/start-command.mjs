export const buildServeArgs = ({ mock }) => [
  'serve',
  '--port',
  '4300',
  ...(mock ? ['--define=MATCHMAP_MOCKS=true'] : []),
];
