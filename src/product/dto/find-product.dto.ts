import { IsAlpha, IsNumber, IsOptional } from "class-validator";

export class FindProductDto {
	@IsAlpha()
	category: string;

	@IsNumber()
	limit: number;

	@IsNumber()
	@IsOptional()
	skip?: number;
}
