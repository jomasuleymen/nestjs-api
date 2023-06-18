import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { Response } from "express";
import UserPayload from "src/auth/decorators/jwt-user-payload.decorator";
import { ACCESS_TOKEN_HEADER, REFRESH_TOKEN_HEADER } from "./auth.constants";
import { AuthService, JwtUserPayload, PairTokens } from "./auth.service";
import JwtToken from "./decorators/jwt-token.decorator";
import UserLoginDTO from "./dto/user-login.dto";
import UserRegisterDTO from "./dto/user-register.dto";
import { AuthRefreshGuard } from "./guards/auth-refresh.guard";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post("register")
	async register(@Body() dto: UserRegisterDTO) {
		try {
			return await this.authService.register(dto);
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}

	@UsePipes(new ValidationPipe())
	@Post("login")
	async login(@Body() dto: UserLoginDTO, @Res() res: Response) {
		try {
			const tokens = await this.authService.login(dto);

			return this.setTokensToResponse(res, tokens);
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}

	@UseGuards(AuthRefreshGuard)
	@Post("refresh-token")
	async refreshToken(
		@Res() res: Response,
		@UserPayload() payload: JwtUserPayload,
		@JwtToken() token: string,
	) {
		try {
			const tokens = await this.authService.refreshToken(payload, token);

			return this.setTokensToResponse(res, tokens);
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}

	private setTokensToResponse(res: Response, tokens: PairTokens): Response {
		return res
			.setHeader(ACCESS_TOKEN_HEADER, tokens.accessToken)
			.setHeader(REFRESH_TOKEN_HEADER, tokens.refreshToken)
			.json(tokens);
	}
}
