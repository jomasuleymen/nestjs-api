import { IsNotEmpty } from "class-validator";

class UserLoginDTO {
	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	password: string;
}

export default UserLoginDTO;
