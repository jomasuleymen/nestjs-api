import { IsEmail, IsNotEmpty } from "class-validator";

class UserLoginrDTO {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;
}

export default UserLoginrDTO;
