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

const lowercasePattern = /\p{Ll}/u;
const uppercasePattern = /\p{Lu}/u;
const specialPattern = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
const whitespacePattern = /\s/u;

export const validateRegisterPassword = (password: string): string | null => {
  const valid =
    password.length >= 6 &&
    password.length <= 20 &&
    lowercasePattern.test(password) &&
    uppercasePattern.test(password) &&
    specialPattern.test(password) &&
    !whitespacePattern.test(password);
  return valid ? null : 'login.register.errorPasswordInvalid';
};
