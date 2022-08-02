"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConnectionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_1 = require("redis");
const constants_1 = require("./constants");
let RedisConnectionService = class RedisConnectionService {
    constructor(configService, configKey, errHandler) {
        this.configService = configService;
        this.configKey = configKey;
        this.errHandler = errHandler;
        if (!configKey)
            throw new Error(`please set a confgi key by register static function`);
        const connections = this.configService.get(configKey) || [];
        const clientMap = new Map();
        connections.map((connection) => {
            const { name = 'default' } = connection;
            if (clientMap.get(name)) {
                throw new Error(`redis connection '${name}' is duplicate`);
            }
            const client = (0, redis_1.createClient)(connection);
            client.connect();
            clientMap.set(name, client);
            // @ts-ignore
            client.on('error', (error) => {
                this.errHandler(error);
            });
        });
        this.clientMap = clientMap;
    }
    getClient(name = 'default') {
        return this.clientMap.get(name);
    }
    getClients() {
        return this.clientMap;
    }
    onModuleDestroy() {
        const connections = this.configService.get(this.configKey) || [];
        connections.forEach((connection) => {
            const { name } = connection;
            this.getClient(name).quit();
        });
    }
};
RedisConnectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.REDIS_CONFIG_KEY)),
    __param(2, (0, common_1.Inject)(constants_1.REDIS_ERR_HANDLER)),
    __metadata("design:paramtypes", [config_1.ConfigService, String, Function])
], RedisConnectionService);
exports.RedisConnectionService = RedisConnectionService;
