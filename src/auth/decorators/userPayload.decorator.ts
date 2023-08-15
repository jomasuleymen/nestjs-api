import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { JwtUserPayload } from "../auth.service";

const UserPayload = createParamDecorator(
	(data: keyof JwtUserPayload, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest() as Request;

		if (!request.user) return null;

		if (data) return request.user[data];

		return request.user;
	},
);

export default UserPayload;
