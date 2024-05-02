import RedisIo, { Redis as RedisType } from "ioredis";
import RedisStore from "connect-redis";

class Redis {
  client: RedisType;

  async init() {
    this.client = new RedisIo({
      port: Number(process.env.REDIS_PORT) || 6379,
      host: process.env.REDIS_HOST || "redis",
    });
  }

  createSessionStore() {
    return new RedisStore({
      client: this.client,
    });
  }
}

const instance = new Redis();

export default instance;
