import { InjectRedis } from "@liaoliaots/nestjs-redis";
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import Redis from "ioredis";
import _ from "lodash";
import { USER_ROLE } from "src/user/user-roles";
import { UserDocument } from "src/user/user.model";
import { UserService } from "src/user/user.service";
import {
	INCORRECT_LOGIN_DATA_MESSAGE,
	USER_NOT_FOUND_MESSAGE,
} from "./auth.constants";
import UserLoginDTO from "./dto/user-login.dto";
import UserRegisterDTO from "./dto/user-register.dto";
import JwtTokenExpiredException from "./exceptions/token-expired.exception";

export type JwtUserPayload = {
	sub: "access" | "refresh";
	id: string;
	email: string;
	role: USER_ROLE;
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
		if (!user) throw new InternalServerErrorException();

		return _.pick(user, "id", "email", "username", "roles");
	}

	async login(dto: UserLoginDTO): Promise<PairTokens> {
		const user = await this.userService.find(dto.username);

		if (!user) throw new BadRequestException(INCORRECT_LOGIN_DATA_MESSAGE);

		const isPasswordCorrect = bcrypt.compareSync(dto.password, user.password);

		if (!isPasswordCorrect)
			throw new BadRequestException(INCORRECT_LOGIN_DATA_MESSAGE);

		return await this.generateTokens(user);
	}

	async refreshToken(
		payload: JwtUserPayload,
		token: string,
	): Promise<PairTokens> {
		const jwtCacheName = this.getRedisTokenKey(payload.id);
		const inCacheToken = await this.redis.get(jwtCacheName);

		if (!inCacheToken || inCacheToken !== token)
			throw new JwtTokenExpiredException();

		const user = await this.userService.findById(payload.id);

		if (!user) throw new BadRequestException(USER_NOT_FOUND_MESSAGE);

		return await this.generateTokens(user);
	}

	private async generateTokens(user: UserDocument): Promise<PairTokens> {
		const payload: Omit<JwtUserPayload, "sub"> = {
			id: user.id,
			email: user.email,
			role: user.role,
		};

		const accessToken = this.generateAccessToken(payload);
		const refreshToken = this.generateRefreshToken(payload);

		const jwtCacheName = this.getRedisTokenKey(user.id);

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
			expiresIn: "15min",
		});
	}

	private generateRefreshToken(payload: Omit<JwtUserPayload, "sub">): string {
		const finalPayload: JwtUserPayload = {
			...payload,
			sub: "refresh",
		};

		return this.jwtService.sign(finalPayload, {
			expiresIn: "30 days",
		});
	}

	private getRedisTokenKey(key: string): string {
		return `jwt:${key}`;
	}
}
