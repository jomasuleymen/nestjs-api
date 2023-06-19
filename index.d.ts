import { JwtUserPayload } from "src/auth/auth.service";

declare global {
	namespace Express {
		export interface Request {
			jwtToken: string;
			user: JwtUserPayload;
		}
	}
}
