import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { UseAuthRoles } from "src/auth/decorators/useAuthRoles.decorator";
import { AuthGuard } from "src/auth/guards/auth-access.guard";
import { USER_ROLE } from "src/user/user-roles";
import { FindProductDto } from "./dto/find-product.dto";
import { Product } from "./product.model";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
	constructor(private productService: ProductService) {}

	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Body() productDTO: Omit<Product, "_id">) {
		return await this.productService.create(productDTO);
	}

	@Get(":id")
	async get(@Param("id") id: string) {
		return await this.productService.get(id);
	}

	@UseAuthRoles(USER_ROLE.CUSTOMER)
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
