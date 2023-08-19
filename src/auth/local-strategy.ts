import {
	Injectable,
	InternalServerErrorException,
	BadRequestException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import LoginFailedException from "./exceptions/loginFailed.exception";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super();
	}

	async validate(username: string, password: string): Promise<any> {
		try {
			const user = await this.authService.validateUser({ username, password });
			return user;
		} catch (err) {
			if (err instanceof LoginFailedException) {
				throw new BadRequestException({
					message: err.message,
					success: false,
				});
			}

			throw new InternalServerErrorException();
		}
	}
}
