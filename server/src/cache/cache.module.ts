import { Module } from '@nestjs/common';
import { CacheModule as NestJsCacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    NestJsCacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  exports: [NestJsCacheModule],
})
export class CacheModule {}
