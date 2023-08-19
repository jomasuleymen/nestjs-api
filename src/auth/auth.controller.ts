import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import UserRegisterDTO from "./dto/user-register.dto";
import { LoginGuard } from "./guards/login.guard";
import UserPayload from "./decorators/userPayload.decorator";
import UserDTO from "./dto/user.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post("register")
	async register(@Body() dto: UserRegisterDTO) {
		return await this.authService.register(dto);
	}

	@UseGuards(LoginGuard)
	@Post("login")
	async login(@UserPayload() user: UserDTO) {
		return {
			message: "Успешный вход",
			success: true,
			user,
		};
	}

	@Get("logout")
	logout(@Req() request: Request): any {
		request.session.destroy(err => {
			if (err) {
				console.warn(err);
			}
		});

		return { msg: "The user session has ended" };
	}
}
