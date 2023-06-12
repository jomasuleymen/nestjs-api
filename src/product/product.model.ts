import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
	collection: "products",
	_id: true,
})
export class Product {
	@Prop({
		required: true,
	})
	image: string;

	@Prop({
		required: true,
	})
	name: string;

	@Prop({
		required: true,
	})
	price: number;

	@Prop({
		required: true,
	})
	quantity: number;
}

export type ProductDocument = HydratedDocument<Product>;

const ProductSchema = SchemaFactory.createForClass(Product);
export default ProductSchema;
