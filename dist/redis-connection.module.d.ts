import { OnModuleDestroy, DynamicModule } from '@nestjs/common';
export declare class RedisConnectionModule implements OnModuleDestroy {
    private readonly redisConnectionService;
    static register(options: {
        configKey?: string;
        errorHandler?: (error: any) => void;
    }): DynamicModule;
    onModuleDestroy(): void;
}
