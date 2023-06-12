import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Product } from "./product.model";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
	constructor(private productService: ProductService) {}

	@Post()
	async create(@Body() productDTO: Omit<Product, "_id">) {
		try {
			return await this.productService.create(productDTO);
		} catch (e) {
			return {
				error: e.message,
			};
		}
	}

	@Get(":id")
	async get(@Param("id") id: string) {
		try {
			return await this.productService.get(id);
		} catch (e) {
			return {
				error: e.message,
			};
		}
	}

	@Get()
	async getAll() {
		return await this.productService.getAll();
	}

	// @Delete(":id")
	// async delete(@Param("id") id: string) {
	// 	return "This action deletes a product";
	// }

	// @Patch(":id")
	// async update(@Param("id") id: string, @Body() productDTO: Product) {
	// 	return "This action updates a product";
	// }

	// @HttpCode(200)
	// @Post("find")
	// async find(@Body() dto: FindProductDto) {
	// 	return "This action returns all products";
	// }
}
