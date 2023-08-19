import { BadRequestException } from "@nestjs/common";
import { INCORRECT_LOGIN_DATA_MESSAGE } from "../auth.constants";

class LoginFailedException extends BadRequestException {
	constructor() {
		super({
			message: INCORRECT_LOGIN_DATA_MESSAGE,
			type: "LoginFailedException",
		});
	}
}

export default LoginFailedException;
