// lib/redis.ts
import Redis from 'ioredis'

export const redis = new Redis({
  host: 'powerful-ray-46227.upstash.io',
  port: 6379,
  password: 'AbSTAAIjcDE4Njg1MzM2Mzk4YWI0Y2I2YmU3MjY0MTBkNDQ2YmI2MHAxMA',
  tls: {}, // required for Upstash free tier
})
