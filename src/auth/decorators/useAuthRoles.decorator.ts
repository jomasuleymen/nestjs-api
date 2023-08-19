import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { USER_ROLE } from "src/user/user-roles";
import { AuthenticateGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export const UseAuthorized = (...roles: USER_ROLE[]): MethodDecorator => {
	if (!roles || !roles.length) {
		return applyDecorators(UseGuards(AuthenticateGuard));
	}

	/**
	 * same as:
	 * return function (...args) {
	 * 	  SetMetadata("roles", roles)(...args);
	 * 	  UseGuards(AuthGuard, RolesGuard)(...args);
	 * };
	 */

	return applyDecorators(
		SetMetadata("roles", roles),
		UseGuards(AuthenticateGuard, RolesGuard),
	);
};
