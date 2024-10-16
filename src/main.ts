import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  const reflector = app.get( Reflector );
  app.useGlobalGuards( new JwtAuthGuard( reflector ) );
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  // config cookies
  app.use(cookieParser());
  //config cors
  app.enableCors(
    {
      "origin": true,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      credentials: true,
    }
  );

  // or "app.enableVersioning()"
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });


  await app.listen(configService.get<string>('PORT'));
}
bootstrap();

// https://drive.google.com/file/d/1ZEJdrBW7fSdsZq4O02vC8-DMD-S-86YI/view