import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: "*",
		credentials: true,
	});

	// Swagger
	const config = new DocumentBuilder()
		.setTitle("App example")
		.setDescription("The project API description")
		.setVersion("1.0")
		.addTag("project")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	await app.listen(3000);
}
bootstrap();
