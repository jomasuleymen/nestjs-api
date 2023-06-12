import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { MongooseModule } from "@nestjs/mongoose";
import ProductSchema, { Product } from "./product.model";

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forFeature([
			{ name: Product.name, schema: ProductSchema },
		]),
	],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
