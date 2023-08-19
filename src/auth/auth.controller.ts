import {
	BadRequestException,
	Body,
	Controller,
	InternalServerErrorException,
	Post,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { Response } from "express";
import { ACCESS_TOKEN_HEADER, REFRESH_TOKEN_HEADER } from "./auth.constants";
import { AuthService, JwtUserPayload, PairTokens } from "./auth.service";
import JwtToken from "./decorators/jwtToken.decorator";
import UserPayload from "./decorators/userPayload.decorator";
import UserLoginDTO from "./dto/user-login.dto";
import UserRegisterDTO from "./dto/user-register.dto";
import { AuthRefreshGuard } from "./guards/auth-refresh.guard";

type LoginSuccessResponse = {
	message: string;
	accessToken: string;
	refreshToken: string;
	success: true;
};

type LoginFailureResponse = {
	message: string;
	success: false;
};

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
	async login(
		@Body() dto: UserLoginDTO,
		@Res() res: Response<LoginSuccessResponse | LoginFailureResponse>,
	) {
		try {
			const tokens = await this.authService.login(dto);
			this.setTokensToResponse(res, tokens);

			return res.json({
				message: "Успешный вход",
				success: true,
				accessToken: tokens.accessToken,
				refreshToken: tokens.refreshToken,
			});
		} catch (err) {
			if (err instanceof BadRequestException) {
				return res.status(200).json({
					message: "неверный пользователь или пароль",
					success: false,
				});
			}

			throw new InternalServerErrorException();
		}
	}

	@UseGuards(AuthRefreshGuard)
	@Post("refresh-token")
	async refreshToken(
		@Res() res: Response,
		@UserPayload() user: JwtUserPayload,
		@JwtToken() token: string,
	) {
		const tokens = await this.authService.refreshToken(user, token);
		this.setTokensToResponse(res, tokens);
		return res.json(tokens);
	}

	private setTokensToResponse(res: Response, tokens: PairTokens): Response {
		return res
			.setHeader(ACCESS_TOKEN_HEADER, tokens.accessToken)
			.setHeader(REFRESH_TOKEN_HEADER, tokens.refreshToken);
	}
}
