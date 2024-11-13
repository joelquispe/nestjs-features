import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { ResponseFormatInterceptor } from './core/interceptors/response.interceptor';

config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //FILTROS PARA EXCEPCIONES
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //   }),
  // );

  //SWAGGER SETUP
  // const config = new DocumentBuilder()
  //   .setTitle('Ficha Pep')
  //   .setDescription('Api Pep')
  //   .setVersion('1.0')
  //   .addTag('pep')
  //   .build();

  //REFLECTO
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors({
    origin: 'http://localhost:4200', // Reemplaza con la URL de tu aplicación de Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  await app.listen(3000);
}
bootstrap();
