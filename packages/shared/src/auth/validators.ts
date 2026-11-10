const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const validateSignInEmail = (email: string): string | null => {
  const value = normalizeEmail(email);
  if (value.length === 0) {
    return 'login.signIn.errorEmailRequired';
  }
  if (value.length > 254) {
    return 'login.signIn.errorEmailTooLong';
  }
  if (!emailPattern.test(value)) {
    return 'login.signIn.errorEmailFormat';
  }
  return null;
};

export const validateSignInPassword = (password: string): string | null => {
  if (password.length === 0) {
    return 'login.signIn.errorPasswordRequired';
  }
  if (password.length < 6 || password.length > 20) {
    return 'login.signIn.errorPasswordLength';
  }
  return null;
};
