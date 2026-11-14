export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Creates an account. Errors carry extensions.code: EMAIL_TAKEN when the email is already in use,
   * USERNAME_TAKEN when the username is already in use, VALIDATION_FAILED when an input breaks
   * its rules, and PASSWORD_INVALID when the password breaks the password rule. For VALIDATION_FAILED
   * and PASSWORD_INVALID, extensions.field names the offending field.
   * The email is required, must not be blank, must have a standard email format and at most 254 characters.
   * It is trimmed and lower-cased before it is stored.
   * The password has 6 to 20 characters, at least one lowercase letter, at least one uppercase letter
   * and at least one special character from the OWASP list of ASCII punctuation and symbols, and it
   * has no whitespace character. Letters and digits are not special characters. Unicode characters
   * are allowed.
   */
  register: User;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type Query = {
  __typename?: 'Query';
  apiVersion: Scalars['String']['output'];
  me: User;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};
