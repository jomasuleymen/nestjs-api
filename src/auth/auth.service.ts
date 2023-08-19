import { Injectable, InternalServerErrorException } from "@nestjs/common";
import bcrypt from "bcrypt";
import _ from "lodash";
import { UserService } from "src/user/user.service";
import UserLoginDTO from "./dto/user-login.dto";
import UserRegisterDTO from "./dto/user-register.dto";
import LoginFailedException from "./exceptions/loginFailed.exception";

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async register(dto: UserRegisterDTO) {
		const user = await this.userService.createUser(dto);
		if (!user) throw new InternalServerErrorException();

		return _.pick(user, "id", "email", "username", "roles");
	}

	async login(dto: UserLoginDTO) {
		const user = await this.userService.find(dto.username);

		if (!user) throw new LoginFailedException();

		const isPasswordCorrect = bcrypt.compareSync(dto.password, user.password);

		if (!isPasswordCorrect) throw new LoginFailedException();

		return _.pick(user, "id", "email", "username", "roles");
	}
}
