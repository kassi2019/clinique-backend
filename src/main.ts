import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  // bodyParser désactivé puis reconfiguré avec une limite étendue
  // (nécessaire pour l'envoi d'images en base64 dans les paramètres)
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Préfixe global : toutes les routes sont sous /api
  app.setGlobalPrefix('api');

  // CORS : autorise le frontend Vue (Vite, port 5173)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  });

  // Validation automatique des DTO (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // HOST : interface d'écoute du backend.
  // - local (défaut) : 0.0.0.0 = accessible depuis le réseau local (mobile...)
  // - production VPS : HOST=127.0.0.1 dans le .env = seul Nginx (même machine) accède au backend
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(process.env.PORT ?? 3000, host);
  console.log(`Backend démarré sur http://${host}:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
