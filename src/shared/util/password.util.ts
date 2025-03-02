import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function comparePassword(
  hashedPassword: string,
  plainPassword: string,
): Promise<boolean> {
  return await argon2.verify(hashedPassword, plainPassword);
}
