import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from "@nestjs/common";
import { UseAuthorized } from "src/auth/decorators/useAuthRoles.decorator";
import { USER_ROLE } from "src/user/user-roles";
import { FindProductDto } from "./dto/find-product.dto";
import { Product } from "./product.model";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
	constructor(private productService: ProductService) {}

	@UseAuthorized(USER_ROLE.ADMIN)
	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Body() productDTO: Omit<Product, "_id">) {
		return await this.productService.create(productDTO);
	}

	@Get(":id")
	async get(@Param("id") id: string) {
		return await this.productService.get(id);
	}

	@UseAuthorized(USER_ROLE.CUSTOMER)
	@UsePipes(
		new ValidationPipe({
			transform: true,
		}),
	)
	@Post("find")
	async find(@Body() dto: FindProductDto) {
		return await this.productService.find(dto);
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
