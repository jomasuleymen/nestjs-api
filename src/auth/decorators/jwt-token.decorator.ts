import { ExecutionContext, createParamDecorator } from "@nestjs/common";

const JwtToken = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();

		return request.token;
	},
);

export default JwtToken;
