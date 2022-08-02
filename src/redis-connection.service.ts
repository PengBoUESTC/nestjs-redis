import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientOptions } from 'redis';
import { REDIS_CONFIG_KEY, REDIS_ERR_HANDLER } from './constants';

import { ClientType } from './types';

@Injectable()
export class RedisConnectionService {
  private readonly clientMap: Map<string, ReturnType<ClientType>>;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS_CONFIG_KEY)
    private readonly configKey: string,
    @Inject(REDIS_ERR_HANDLER)
    private readonly errHandler: (error: any) => void,
  ) {
    if (!configKey)
      throw new Error(`please set a confgi key by register static function`);
    const connections = this.configService.get(configKey) || [];
    const clientMap = new Map<string, ReturnType<ClientType>>();

    connections.map((connection: RedisClientOptions) => {
      const { name = 'default' } = connection;
      if (clientMap.get(name)) {
        throw new Error(`redis connection '${name}' is duplicate`);
      }
      const client = createClient(connection);
      client.connect();
      clientMap.set(name, client);
      // @ts-ignore
      client.on('error', (error: any) => {
        this.errHandler(error);
      });
    });
    this.clientMap = clientMap;
  }

  getClient(name = 'default'): ReturnType<ClientType> {
    return this.clientMap.get(name);
  }

  getClients(): Map<string, ReturnType<ClientType>> {
    return this.clientMap;
  }

  onModuleDestroy() {
    const connections = this.configService.get(this.configKey) || [];
    connections.forEach((connection) => {
      const { name } = connection;
      this.getClient(name).quit();
    });
  }
}
