import { getRedis } from "./redis";

const TTL = 60;

export async function cacheGet<T>(
  key: string
): Promise<T | null> {

  const redis = getRedis();

  if (!redis) {
    return null;
  }

  try {
    const data = await redis.get(key);

    return data
      ? JSON.parse(data)
      : null;

  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: any,
  ttl = TTL
) {

  const redis = getRedis();

  if (!redis) {
    return;
  }

  try {
    await redis.set(
      key,
      JSON.stringify(value),
      "EX",
      ttl
    );

  } catch {}
}

export async function cacheInvalidate(
  pattern: string
) {

  const redis = getRedis();

  if (!redis) {
    return;
  }

  try {
    const stream = redis.scanStream({
      match: pattern,
    });

    stream.on(
      "data",
      async (keys: string[]) => {
        try {
          if (keys.length) {
            await redis.del(...keys);
          }
        } catch {}
      }
    );

  } catch {}
}