import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import Redis from "ioredis";
import { UserService } from "src/user/user.service";
import { INCORRECT_LOGIN_DATA_MESSAGE } from "./auth.constants";
import UserLoginDTO from "./dto/user-login.dto";
import UserRegisterDTO from "./dto/user-register.dto";
import JwtTokenExpiredException from "./exceptions/token-expired.exception";

export type JwtUserPayload = {
	sub: "access" | "refresh";
	id: string;
	email: string;
};

export type PairTokens = {
	accessToken: string;
	refreshToken: string;
};

@Injectable()
export class AuthService {
	constructor(
		@InjectRedis() private readonly redis: Redis,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	async register(dto: UserRegisterDTO) {
		const user = await this.userService.createUser(dto);

		return {
			_id: user._id,
			username: user.username,
			email: user.email,
		};
	}

	async login(dto: UserLoginDTO): Promise<PairTokens> {
		const user = await this.userService.find(dto.username);

		if (!user) throw new Error(INCORRECT_LOGIN_DATA_MESSAGE);

		const isPasswordCorrect = bcrypt.compareSync(dto.password, user.password);

		if (!isPasswordCorrect) throw new Error(INCORRECT_LOGIN_DATA_MESSAGE);

		return await this.generateTokens({
			id: user._id.toString(),
			email: user.email,
		});
	}

	async refreshToken(
		payload: JwtUserPayload,
		token: string,
	): Promise<PairTokens> {
		const jwtCacheName = this.getRedisTokenKey(payload.id);
		const cachedToken = await this.redis.get(jwtCacheName);

		if (!cachedToken || cachedToken !== token)
			throw new JwtTokenExpiredException();

		return await this.generateTokens({
			id: payload.id,
			email: payload.email,
		});
	}

	private async generateTokens(
		payload: Omit<JwtUserPayload, "sub">,
	): Promise<PairTokens> {
		const { id: userId } = payload;

		const accessToken = this.generateAccessToken(payload);
		const refreshToken = this.generateRefreshToken(payload);

		const jwtCacheName = this.getRedisTokenKey(userId);

		await this.redis.set(jwtCacheName, refreshToken);

		return {
			accessToken,
			refreshToken,
		};
	}

	private generateAccessToken(payload: Omit<JwtUserPayload, "sub">): string {
		const finalPayload: JwtUserPayload = {
			...payload,
			sub: "access",
		};

		return this.jwtService.sign(finalPayload, {
			expiresIn: "15s",
		});
	}

	private generateRefreshToken(payload: Omit<JwtUserPayload, "sub">): string {
		const finalPayload: JwtUserPayload = {
			...payload,
			sub: "refresh",
		};

		return this.jwtService.sign(finalPayload, {
			expiresIn: "7h",
		});
	}

	private getRedisTokenKey(key: string): string {
		return `jwt:${key}`;
	}
}
