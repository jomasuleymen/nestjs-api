import { RedisModuleOptions } from "@liaoliaots/nestjs-redis";
import { ConfigService } from "@nestjs/config";

export const getRedisConfig = (config: ConfigService): RedisModuleOptions => {
	return {
		config: {
			host: config.get<string>("REDIS_HOST"),
			port: parseInt(config.get<string>("REDIS_PORT", "6379")),
			password: config.get<string>("REDIS_PASSWORD"),
			onClientCreated: () => {
				console.log("Redis client created successfully");
			},
		},
	};
};
