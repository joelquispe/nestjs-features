import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { ResponseFormatInterceptor } from './core/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import corsConfig from './config/cors.config';
import { JwtAuthGuard } from './modules/auth/guards/jwtAuth.guard';

config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //FILTROS PARA EXCEPCIONES
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  //SWAGGER SETUP
  const config = new DocumentBuilder()
    .setTitle('NestJs Features')
    .setDescription('Implementaciones de ejemplo')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: { persistAuthorization: true },
  });

  //REFLECTO
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ResponseFormatInterceptor(),
    new ClassSerializerInterceptor(reflector),
  );
  // WEBSOCKETS
  app.useWebSocketAdapter(new IoAdapter(app));

  // CORS
  app.enableCors(corsConfig);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  console.log(`Listen on ${configService.get('port') || 3000}`);
  await app.listen(configService.get('port') || 3000);
}
bootstrap();
