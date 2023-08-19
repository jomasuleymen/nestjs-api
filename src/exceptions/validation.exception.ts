import { BadRequestException, ValidationError } from "@nestjs/common";

class ValidationException extends BadRequestException {
	constructor(errors: ValidationError[]) {
		const result = errors.map(error => ({
			property: error.property,
			constraints: Object.values(error?.constraints || {}),
		}));

		super(result);
	}
}

export default ValidationException;
