const limitErrorKeys = new Map<string, string>([
  ['invalid_email', 'login.signIn.errorInvalidEmail'],
  ['email_too_long', 'login.signIn.errorEmailTooLong'],
  ['invalid_password', 'login.signIn.errorInvalidPassword'],
]);

export const loginLimitErrorKey = (code: string): string | null => limitErrorKeys.get(code) ?? null;
