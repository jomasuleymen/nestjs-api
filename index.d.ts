import UserDTO from "src/auth/dto/user.dto";

declare global {
	namespace Express {
		export interface Request {
			user: UserDTO;
		}
	}
}
