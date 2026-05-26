import Redis from "ioredis";

let redis: Redis | null = null;

export function initRedis() {
  try {
    const client = new Redis({
      host: "127.0.0.1",
      port: 6379,

      // evita loops infinitos
      retryStrategy: () => null,
    });

    client.on("connect", () => {
      console.log("  🟢 Redis:   conectado");
      redis = client;
    });

    client.on("error", (err) => {
      console.log("  🔴 Redis:   conectado",
        err.message
      );

      redis = null;
    });

  } catch {
    redis = null;
  }
}

// ✅ getter seguro
export function getRedis() {
  return redis;
}