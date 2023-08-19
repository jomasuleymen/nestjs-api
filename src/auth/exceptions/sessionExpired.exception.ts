import { BadRequestException } from "@nestjs/common";

class SessionExpiredException extends BadRequestException {
	constructor() {
		super({
			message: "Session has been expired",
			type: "SessionExpiredException",
		});
	}
}

export default SessionExpiredException;
