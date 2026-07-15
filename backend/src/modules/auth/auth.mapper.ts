export function toSafeUser<
  T extends {
    password: string;
  }
>(user: T) {
  const { password, ...safeUser } = user;

  return safeUser;
}