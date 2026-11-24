export type MockUser = {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  unreadNotifications?: number;
};

export type RefreshSession = {
  token: string;
  userId: string;
  revoked: boolean;
};

export type LoginFailures = {
  windowStart: number;
  count: number;
};

export type MockState = {
  users: MockUser[];
  refreshSessions: RefreshSession[];
  failures: Record<string, LoginFailures>;
};

export type MockContext = {
  now: number;
  random: (length: number) => string;
};

export type MockClient = 'web' | 'mobile';
