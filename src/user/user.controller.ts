import { Controller, Get } from "@nestjs/common";
import { JwtUserPayload } from "src/auth/auth.service";
import { UseAuthorized } from "src/auth/decorators/useAuthRoles.decorator";
import UserPayload from "src/auth/decorators/userPayload.decorator";
import { UserService } from "./user.service";
import _ from "lodash";

@Controller("user")
export class UserController {
	constructor(private userService: UserService) {}

	@Get("me")
	@UseAuthorized()
	async me(@UserPayload() jwtPayload: JwtUserPayload) {
		const user = await this.userService.findById(jwtPayload.id);
		return _.pick(user, "id", "email", "username", "roles");
	}
}
