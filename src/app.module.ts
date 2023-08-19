import { RedisModule, RedisService } from "@liaoliaots/nestjs-redis";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import RedisStore from "connect-redis";
import session from "express-session";
import passport from "passport";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { getMongooseConfig } from "./config/database.config";
import { getRedisConfig } from "./config/redis.config";
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
		RedisModule.forRootAsync({
			inject: [ConfigService],
			useFactory: getRedisConfig,
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
export class AppModule implements NestModule {
	constructor(private readonly redis: RedisService) {}

	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				session({
					store: new RedisStore({
						client: this.redis.getClient(),
						prefix: "sessionId:",
					}),
					saveUninitialized: false,
					secret: "sup3rs3cr3t",
					resave: false,
					cookie: {
						sameSite: true,
						httpOnly: false,
						maxAge: 1000 * 60 * 60 * 24 * 7,
					},
				}),
				passport.initialize(),
				passport.session(),
			)
			.forRoutes("*");
	}
}
