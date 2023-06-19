import { SetMetadata, UseGuards } from "@nestjs/common";
import { USER_ROLE } from "src/user/user-roles";
import { AuthGuard } from "../guards/auth-access.guard";
import { RolesGuard } from "../guards/roles.guard";

export const UseAuthRoles = (...roles: USER_ROLE[]): MethodDecorator => {
	return function (...args) {
		SetMetadata("roles", roles)(...args);
		UseGuards(AuthGuard, RolesGuard)(...args);
	};
};
