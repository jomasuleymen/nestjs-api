import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { getMongooseConfig } from "./config/database.config";
import { ProductModule } from "./product/product.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: getMongooseConfig,
		}),
		JwtModule.registerAsync({
			inject: [ConfigService],
			global: true,
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>("JWT_SECRET"),
			}),
		}),
		RedisModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				config: {
					host: config.get<string>("REDIS_HOST"),
					port: parseInt(config.get<string>("REDIS_PORT", "6379")),
					onClientCreated: () => {
						console.log("Redis client created successfully");
					},
				},
			}),
		}),
		AuthModule,
		ProductModule,
		UserModule,
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
