import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  const apiPrefix = configService.get('app.apiPrefix');
  app.setGlobalPrefix(apiPrefix);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('StarWars API')
    .setDescription('A comprehensive StarWars API with characters and movies')
    .setVersion('1.0')
    .addTag('Characters', 'Character management endpoints')
    .addTag('Movies', 'Movie management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // CORS configuration
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = configService.get('app.port');
  await app.listen(port);

  console.log(`🚀 StarWars API running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/${apiPrefix}/docs`);
  console.log(`📊 Environment: ${configService.get('app.nodeEnv')}`);
}

bootstrap();