import { Controller, Get } from "@nestjs/common";
import { JwtUserPayload } from "src/auth/auth.service";
import { UseAuthorized } from "src/auth/decorators/useAuthRoles.decorator";
import UserPayload from "src/auth/decorators/userPayload.decorator";

@Controller("user")
export class UserController {
	// constructor(private userService: UserService) {}

	@Get("me")
	@UseAuthorized()
	async me(@UserPayload() user: JwtUserPayload) {
		return user;
	}
}
