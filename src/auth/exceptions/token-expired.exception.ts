import { BadRequestException } from "@nestjs/common";

class JwtTokenExpiredException extends BadRequestException {
	constructor() {
		super({
			message: "Error validating access token: Session has expired",
			type: "TokenExpiredException",
			code: 190,
		});
	}
}

export default JwtTokenExpiredException;
