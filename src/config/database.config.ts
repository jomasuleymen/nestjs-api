import { ConfigService } from "@nestjs/config";
import { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

export const getMongooseConfig = (
	configService: ConfigService,
): MongooseModuleFactoryOptions => {
	return {
		uri: getConnectionUri(configService),
		useNewUrlParser: true,
		authSource: "admin",
	};
};

const getConnectionUri = (configService: ConfigService): string => {
	return (
		"mongodb://" +
		configService.get("MONGO_USER") +
		":" +
		configService.get("MONGO_PASSWORD") +
		"@" +
		configService.get("MONGO_HOST") +
		":" +
		configService.get("MONGO_PORT") +
		"/" +
		configService.get("MONGO_DB")
	);
};
