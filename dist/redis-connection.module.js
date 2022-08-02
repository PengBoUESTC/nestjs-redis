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
var RedisConnectionModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConnectionModule = void 0;
const common_1 = require("@nestjs/common");
const redis_connection_service_1 = require("./redis-connection.service");
const constants_1 = require("./constants");
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => { };
let RedisConnectionModule = RedisConnectionModule_1 = class RedisConnectionModule {
    static register(options) {
        const { configKey = constants_1.REDIS_CONFIG_KEY_STR, errorHandler = noop } = options || {};
        const providers = [
            redis_connection_service_1.RedisConnectionService,
            {
                provide: constants_1.REDIS_CONFIG_KEY,
                useValue: configKey,
            },
            {
                provide: constants_1.REDIS_ERR_HANDLER,
                useValue: errorHandler,
            },
        ];
        return {
            module: RedisConnectionModule_1,
            providers: providers,
            exports: [...providers],
        };
    }
    onModuleDestroy() {
        this.redisConnectionService.onModuleDestroy();
    }
};
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", redis_connection_service_1.RedisConnectionService)
], RedisConnectionModule.prototype, "redisConnectionService", void 0);
RedisConnectionModule = RedisConnectionModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [redis_connection_service_1.RedisConnectionService],
        exports: [redis_connection_service_1.RedisConnectionService],
    })
], RedisConnectionModule);
exports.RedisConnectionModule = RedisConnectionModule;
