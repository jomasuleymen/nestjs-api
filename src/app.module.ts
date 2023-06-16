import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { getMongooseConfig } from "./config/database.config";
import { ProductModule } from "./product/product.module";
import { JwtModule } from "@nestjs/jwt";
import { RedisModule } from "@liaoliaots/nestjs-redis";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: false,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongooseConfig,
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			global: true,
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>("JWT_SECRET"),
			}),
		}),
		RedisModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				config: {
					host: config.get<string>("REDIS_HOST"),
					port: parseInt(config.get<string>("REDIS_PORT") || "6379"),
					onClientCreated: () => {
						console.log("Redis client created successfully");
					},
				},
			}),
		}),
		AuthModule,
		ProductModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: "appService",
			useClass: AppService,
		},
	],
	exports: [],
})
export class AppModule {}
