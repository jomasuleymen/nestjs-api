import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

const JwtToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest() as Request;

	return request.jwtToken;
});

export default JwtToken;
