import { Module, Inject, Global, OnModuleDestroy, DynamicModule } from '@nestjs/common';

import { RedisConnectionService } from './redis-connection.service';

import { REDIS_CONFIG_KEY, REDIS_CONFIG_KEY_STR, REDIS_ERR_HANDLER } from './constants';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
@Global()
@Module({
  providers: [RedisConnectionService],
  exports: [RedisConnectionService],
})
export class RedisConnectionModule implements OnModuleDestroy {
  @Inject()
  private readonly redisConnectionService: RedisConnectionService;

  static register(options: {
    configKey?: string;
    errorHandler?: (error: any) => void;
  }): DynamicModule {
    const { configKey = REDIS_CONFIG_KEY_STR, errorHandler = noop } =
      options || {};
    const providers = [
      RedisConnectionService,
      {
        provide: REDIS_CONFIG_KEY,
        useValue: configKey,
      },
      {
        provide: REDIS_ERR_HANDLER,
        useValue: errorHandler,
      },
    ];
    return {
      module: RedisConnectionModule,
      providers: providers,
      exports: [...providers],
    };
  }

  onModuleDestroy() {
    this.redisConnectionService.onModuleDestroy();
  }
}
