import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { USER_ROLE } from "./user-roles";

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

	@Prop({
		type: String,
		default: USER_ROLE.CUSTOMER,
		enum: Object.values(USER_ROLE),
	})
	role: USER_ROLE;
}

export type UserDocument = HydratedDocument<User>;

const UserSchema = SchemaFactory.createForClass(User);

export default UserSchema;
