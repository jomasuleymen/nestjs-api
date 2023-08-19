import { Controller, Get } from "@nestjs/common";
import { UseAuthorized } from "src/auth/decorators/useAuthRoles.decorator";
import UserPayload from "src/auth/decorators/userPayload.decorator";
import UserDTO from "src/auth/dto/user.dto";

@Controller("user")
export class UserController {
	// constructor(private userService: UserService) {}

	@Get("me")
	@UseAuthorized()
	async me(@UserPayload() user: UserDTO) {
		return user;
	}
}
