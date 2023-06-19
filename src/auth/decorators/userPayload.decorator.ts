import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

const UserPayload = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest() as Request;

		return request.user;
	},
);

export default UserPayload;
