const maxLength = 30;
const minBaseLength = 3;
const fallbackPrefix = 'user_';
const randomLength = 8;

const truncate = (value: string, length: number): string => value.slice(0, length);

export const deriveUsername = (
  email: string,
  isTaken: (username: string) => boolean,
  random: (length: number) => string,
): string => {
  const localPart = email.slice(0, email.indexOf('@')).toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const base =
    localPart.length < minBaseLength ? `${fallbackPrefix}${random(randomLength)}` : localPart;
  let candidate = truncate(base, maxLength);
  for (let n = 2; isTaken(candidate); n++) {
    const suffix = `_${n}`;
    candidate = `${truncate(base, maxLength - suffix.length)}${suffix}`;
  }
  return candidate;
};
