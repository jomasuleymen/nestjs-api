import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { FindProductDto } from "./dto/find-product.dto";
import { Product, ProductDocument } from "./product.model";

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name)
		private productSchema: Model<ProductDocument>,
	) {}

	async create(dto: Omit<Product, "_id">) {
		const newProduct = new this.productSchema(dto);
		return await newProduct.save();
	}

	async get(id: string) {
		const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
		if (!isValidObjectId) throw new Error("Invalid ObjectId");
		return await this.productSchema.findById(id);
	}

	async find(dto: FindProductDto) {
		return await this.productSchema
			.find()
			.limit(dto.limit)
			.skip(dto.skip || 0);
	}
}
