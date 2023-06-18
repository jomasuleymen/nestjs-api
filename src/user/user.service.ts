import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import bcrypt from "bcrypt";
import { isEmail, isMongoId } from "class-validator";
import mongoose, { Model } from "mongoose";
import UserRegisterDTO from "src/auth/dto/user-register.dto";
import { User } from "./user.model";
import * as _ from "lodash";

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	async findById(id: string | mongoose.Types.ObjectId) {
		if (!isMongoId(id)) throw new Error("input should be objectId");
		return await this.userModel.findById(id);
	}

	async find(username: string) {
		return await this.userModel.findOne(this.getEmailOrUsername(username));
	}

	async createUser(dto: UserRegisterDTO) {
		const userByEmail = await this.userModel.exists({ email: dto.email });
		if (userByEmail) throw new Error("email is already taken");

		const userByUsername = await this.userModel.exists({
			username: dto.username,
		});
		if (userByUsername) throw new Error("username is already taken");

		const decryptedPassword = bcrypt.hashSync(dto.password, 10);

		const newUser = new this.userModel({
			email: dto.email,
			username: dto.username,
			password: decryptedPassword,
		});

		await newUser.save();

		return _.pick(newUser, "_id", "email", "username");
	}

	private getEmailOrUsername(username: string): mongoose.FilterQuery<User> {
		if (isEmail(username)) return { email: username };
		return { username };
	}
}
