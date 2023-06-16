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
import UserPayload from "src/decorators/user.decorator";
import { ACCESS_TOKEN_HEADER, REFRESH_TOKEN_HEADER } from "./auth.constants";
import { AuthService, JwtAuthPayload } from "./auth.service";
import UserLoginrDTO from "./dto/user-login.dto";
import UserRegisterDTO from "./dto/user-register.dto";
import { AuthGuard } from "./guards/auth.guard";
import JwtToken from "./decorators/jwt-token.decorator";

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
	async login(@Body() dto: UserLoginrDTO, @Res() res: Response) {
		try {
			const tokens = await this.authService.login(dto);

			return res
				.setHeader(ACCESS_TOKEN_HEADER, tokens.accessToken)
				.setHeader(REFRESH_TOKEN_HEADER, tokens.refreshToken)
				.json(tokens);
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}

	@UseGuards(AuthGuard)
	@Post("refresh-token")
	async refreshToken(
		@Res() res: Response,
		@UserPayload() user: JwtAuthPayload,
		@JwtToken() token: string,
	) {
		try {
			const tokens = await this.authService.refreshToken(
				user.sub,
				user.email,
				token,
			);

			return res
				.setHeader(ACCESS_TOKEN_HEADER, tokens.accessToken)
				.setHeader(REFRESH_TOKEN_HEADER, tokens.refreshToken)
				.json(tokens);
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}
}
