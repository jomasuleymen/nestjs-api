import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtUserPayload } from "src/auth/auth.service";
import UserPayload from "src/auth/decorators/jwt-user.decorator";
import { AuthGuard } from "src/auth/guards/auth-access.guard";

@Controller("user")
export class UserController {
	// constructor(private userService: UserService) {}

	@Get("me")
	@UseGuards(AuthGuard)
	async me(@UserPayload() user: JwtUserPayload) {
		return user;
	}
}
