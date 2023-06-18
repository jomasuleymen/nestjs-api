import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
	collection: "users",
	_id: true,
})
export class User {
	@Prop({
		required: true,
		index: true,
	})
	username: string;

	@Prop({
		required: true,
		index: true,
	})
	email: string;

	@Prop({
		required: true,
	})
	password: string;
}

export type UserDocument = HydratedDocument<User>;

const UserSchema = SchemaFactory.createForClass(User);

export default UserSchema;
