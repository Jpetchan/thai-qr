import { redis } from '@/lib/redis'

await redis.incr('generate_count')