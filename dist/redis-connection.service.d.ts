import { ConfigService } from '@nestjs/config';
import { ClientType } from './types';
export declare class RedisConnectionService {
    private readonly configService;
    private readonly configKey;
    private readonly errHandler;
    private readonly clientMap;
    constructor(configService: ConfigService, configKey: string, errHandler: (error: any) => void);
    getClient(name?: string): ReturnType<ClientType>;
    getClients(): Map<string, ReturnType<ClientType>>;
    onModuleDestroy(): void;
}
