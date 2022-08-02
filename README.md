# nestjs-redis

## config redis by nestjs/config

1. based on node-redis connection options ```RedisClientOptions```

```javascript
  RedisConfig: [
    {
      //redis[s]://[[username][:password]@][host][:port][/db-number]:
      url: 'redis://127.0.0.1:6379',
      name: 'test',
    },
  ],
```

2. register redis module by static function register

```javascript
RedisConnectionModule.register({
  configKey: 'RedisConfig',
  errorHandler: (error) => {
    // err handler
  }
}),
```

3. get redis client by redisConnectionService

```javascript
@Injectable()
export class UserService {
  @Inject()
  private readonly redisConnectionService: RedisConnectionService;

  async getcache() {
    const redisClient = this.redisConnectionService.getClient('test');
    return await redisClient.get('xx')
  }
}
```

4. enable nestjs shutdownhooks, so that the destory hooks of redis connection module can exe .

```javascript
  app.enableShutdownHooks();
```

## problems

1. if u use webpack bundle you project, plz compile  node-redis by babel like this. 
```javascript
    rules: [
      {
        test: /\.m?js$/,
        include: [
          path.join(__dirname, 'node_modules/redis'),
          path.join(__dirname, 'node_modules/@redis'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ]
```