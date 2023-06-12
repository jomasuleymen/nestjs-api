import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductDocument, Product } from "./product.model";

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name)
		private productSchema: Model<ProductDocument>,
	) {}

	async create(dto: Omit<Product, "_id">) {
		const newProduct = new this.productSchema(dto);
		return newProduct.save();
	}

	async get(id: string) {
		return this.productSchema.findById(id);
	}

	async getAll() {
		return this.productSchema.find();
	}
}
