import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import bcrypt from "bcrypt";
import { isEmail } from "class-validator";
import mongoose, { Model } from "mongoose";
import UserRegisterDTO from "src/auth/dto/user-register.dto";
import { User } from "./user.model";

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	async createUser(dto: UserRegisterDTO) {
		const userByEmail = await this.userModel.exists({ email: dto.email });
		if (userByEmail) throw new BadRequestException("email is already taken");

		const userByUsername = await this.userModel.exists({
			username: dto.username,
		});
		if (userByUsername)
			throw new BadRequestException("username is already taken");

		const decryptedPassword = bcrypt.hashSync(dto.password, 10);

		const newUser = new this.userModel({
			email: dto.email,
			username: dto.username,
			password: decryptedPassword,
		});

		await newUser.save();

		return newUser;
	}

	async findById(id: string | mongoose.Types.ObjectId) {
		if (!mongoose.Types.ObjectId.isValid(id))
			throw new BadRequestException("input should be objectId");

		const user = await this.userModel.findById(id);
		return user;
	}

	async find(username: string) {
		const user = await this.userModel.findOne(
			this.getEmailOrUsername(username),
		);

		return user;
	}

	private getEmailOrUsername(username: string): mongoose.FilterQuery<User> {
		if (isEmail(username)) return { email: username };
		return { username };
	}
}
