import { IsEmail, IsStrongPassword, Length } from "class-validator";

class UserRegisterDTO {
	@Length(3, 18, {
		message: "username length should me greater than 3 and less than 18",
	})
	username: string;

	@IsEmail()
	email: string;

	@IsStrongPassword({
		minLength: 4,
		minNumbers: 0,
		minUppercase: 0,
		minSymbols: 0,
		minLowercase: 0,
	})
	password: string;
}

export default UserRegisterDTO;
