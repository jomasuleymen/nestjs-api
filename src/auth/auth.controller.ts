import {
	Body,
	Controller,
	Post,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { Response } from "express";
import { ACCESS_TOKEN_HEADER, REFRESH_TOKEN_HEADER } from "./auth.constants";
import { AuthService, JwtUserPayload, PairTokens } from "./auth.service";
import UserPayload from "./decorators/jwt-user.decorator";
import UserLoginDTO from "./dto/user-login.dto";
import UserRegisterDTO from "./dto/user-register.dto";
import { AuthRefreshGuard } from "./guards/auth-refresh.guard";
import JwtToken from "./decorators/jwt-token.decorator";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post("register")
	async register(@Body() dto: UserRegisterDTO) {
		return await this.authService.register(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post("login")
	async login(@Body() dto: UserLoginDTO, @Res() res: Response) {
		const tokens = await this.authService.login(dto);

		return this.setTokensToResponse(res, tokens);
	}

	@UseGuards(AuthRefreshGuard)
	@Post("refresh-token")
	async refreshToken(
		@Res() res: Response,
		@UserPayload() user: JwtUserPayload,
		@JwtToken() token: string,
	) {
		const tokens = await this.authService.refreshToken(user, token);

		return this.setTokensToResponse(res, tokens);
	}

	private setTokensToResponse(res: Response, tokens: PairTokens): Response {
		return res
			.setHeader(ACCESS_TOKEN_HEADER, tokens.accessToken)
			.setHeader(REFRESH_TOKEN_HEADER, tokens.refreshToken)
			.json(tokens);
	}
}
