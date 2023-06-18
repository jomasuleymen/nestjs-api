import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth-access.guard";
import { FindProductDto } from "./dto/find-product.dto";
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
			throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Get(":id")
	async get(@Param("id") id: string) {
		try {
			return await this.productService.get(id);
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
		}
	}

	@UsePipes(
		new ValidationPipe({
			transform: true,
		}),
	)
	@UseGuards(AuthGuard)
	@HttpCode(200)
	@Post("find")
	async find(@Body() dto: FindProductDto) {
		try {
			return await this.productService.find(dto);
		} catch (err) {
			throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
		}
	}

	// @Delete(":id")
	// async delete(@Param("id") id: string) {
	// 	return "This action deletes a product";
	// }

	// @Patch(":id")
	// async update(@Param("id") id: string, @Body() productDTO: Product) {
	// 	return "This action updates a product";
	// }
}
