import { Buffer } from 'buffer';

export const encodeCredentials = (username: string, password: string): string  => {
  const encodedUsername = encodeURIComponent(username);
  const encodedPassword = encodeURIComponent(password);
  const concatenated = `${encodedUsername}:${encodedPassword}`;
  return Buffer.from(concatenated).toString('base64');
}
