import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import {
	AUTH_TYPE_HEADER,
	INAPPROPRIATE_TOKEN_MESSAGE,
} from "../auth.constants";

import { JwtUserPayload } from "../auth.service";
import JwtTokenExpiredException from "../exceptions/token-expired.exception";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException();
		}

		let payload: JwtUserPayload;

		try {
			payload = this.jwtService.verify<JwtUserPayload>(token);
		} catch (err) {
			throw new JwtTokenExpiredException();
		}

		if (payload.sub !== "access")
			throw new UnauthorizedException(INAPPROPRIATE_TOKEN_MESSAGE);

		request.user = payload;

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === AUTH_TYPE_HEADER ? token : undefined;
	}
}
