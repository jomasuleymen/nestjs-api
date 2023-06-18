import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { JwtUserPayload } from "../auth.service";
import JwtTokenExpiredException from "../exceptions/token-expired.exception";
import { INAPPROPRIATE_TOKEN_MESSAGE } from "../auth.constants";

@Injectable()
export class AuthRefreshGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.body["refreshToken"];

		if (!token) {
			throw new UnauthorizedException();
		}

		let payload: JwtUserPayload;

		try {
			payload = this.jwtService.verify<JwtUserPayload>(token);
		} catch (err) {
			throw new JwtTokenExpiredException();
		}

		if (payload.sub !== "refresh")
			throw new UnauthorizedException(INAPPROPRIATE_TOKEN_MESSAGE);

		request.user = payload;
		request.token = token;

		return true;
	}
}
