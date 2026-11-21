export const buildServeArgs = ({ mock }) =>
  mock
    ? ['serve', '--port', '4333', '--define=MATCHMAP_MOCKS=true']
    : ['serve', '--port', '4300'];
