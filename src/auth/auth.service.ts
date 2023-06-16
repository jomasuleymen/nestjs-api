import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import bcrypt from "bcrypt";
import { Model } from "mongoose";
import { INCORRECT_LOGIN_DATA_MESSAGE } from "./auth.constants";
import UserLoginrDTO from "./dto/user-login.dto";
import UserRegisterDTO from "./dto/user-register.dto";
import { User } from "./user.model";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import JwtTokenExpiredException from "./exceptions/token-expired.exception";

export type JwtAuthPayload = {
	sub: string;
	email: string;
};

export type PairTokens = {
	accessToken: string;
	refreshToken: string;
};

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userSchema: Model<User>,
		@InjectRedis() private redis: Redis,
		private jwtService: JwtService,
	) {}

	async register(dto: UserRegisterDTO) {
		const user = await this.userSchema.findOne({ email: dto.email });

		if (user) throw new Error("User already exists");

		const decryptedPassword = bcrypt.hashSync(dto.password, 10);

		const newUser = new this.userSchema({
			email: dto.email,
			password: decryptedPassword,
		});

		await newUser.save();

		return {
			_id: newUser._id,
			email: newUser.email,
		};
	}

	async login(dto: UserLoginrDTO): Promise<PairTokens> {
		const user = await this.userSchema.findOne({ email: dto.email });

		if (!user) throw new Error(INCORRECT_LOGIN_DATA_MESSAGE);

		const isPasswordCorrect = bcrypt.compareSync(dto.password, user.password);

		if (!isPasswordCorrect) throw new Error(INCORRECT_LOGIN_DATA_MESSAGE);

		const payload: JwtAuthPayload = {
			sub: user._id.toString(),
			email: user.email,
		};

		const accessToken = this.generateAccessToken(payload);
		const refreshToken = this.generateRefreshToken(payload);

		await this.redis.set(this.getRedisTokenKey(payload.sub), refreshToken);

		return {
			accessToken,
			refreshToken,
		};
	}

	async refreshToken(
		userId: string,
		email: string,
		token: string,
	): Promise<PairTokens> {
		const jwtCacheName = this.getRedisTokenKey(userId);
		const cachedToken = await this.redis.get(jwtCacheName);

		if (!cachedToken || cachedToken !== token)
			throw new JwtTokenExpiredException();

		const payload: JwtAuthPayload = {
			sub: userId,
			email,
		};

		const accessToken = this.generateAccessToken(payload);
		const refreshToken = this.generateRefreshToken(payload);

		await this.redis.set(jwtCacheName, refreshToken);

		return {
			accessToken,
			refreshToken,
		};
	}

	private generateAccessToken(payload: JwtAuthPayload): string {
		return this.jwtService.sign(payload, {
			expiresIn: "5m",
		});
	}

	private generateRefreshToken(payload: JwtAuthPayload): string {
		return this.jwtService.sign(payload, {
			expiresIn: "7h",
		});
	}

	private getRedisTokenKey(key: string): string {
		return `jwt:${key}`;
	}
}
