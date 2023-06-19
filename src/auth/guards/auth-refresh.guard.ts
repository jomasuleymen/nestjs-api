import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Request } from "express";
import { INAPPROPRIATE_TOKEN_MESSAGE } from "../auth.constants";
import { JwtUserPayload } from "../auth.service";
import JwtTokenExpiredException from "../exceptions/token-expired.exception";

@Injectable()
export class AuthRefreshGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest() as Request;
		const token = request.body["refreshToken"];

		if (!token) {
			throw new UnauthorizedException();
		}

		const payload: JwtUserPayload = this.verifyToken(token);

		if (payload.sub !== "refresh")
			throw new UnauthorizedException(INAPPROPRIATE_TOKEN_MESSAGE);

		request.user = payload;
		request.jwtToken = token;

		return true;
	}

	verifyToken(token: string): JwtUserPayload {
		try {
			return this.jwtService.verify<JwtUserPayload>(token);
		} catch (err) {
			throw new JwtTokenExpiredException();
		}
	}
}
