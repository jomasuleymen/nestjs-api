import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { getMongooseConfig } from "./config/database.config";
import { ProductModule } from "./product/product.module";

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongooseConfig,
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
