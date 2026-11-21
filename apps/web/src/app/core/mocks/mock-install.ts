import { mockApolloLink } from './mock-apollo.link';
import { installMockHandlers } from './mock-dispatch';
import { mockHttpInterceptor } from './mock-http.interceptor';

export const installMocks = (): void => {
  installMockHandlers({ http: mockHttpInterceptor, apollo: mockApolloLink });
};
