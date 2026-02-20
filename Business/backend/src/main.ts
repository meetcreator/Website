import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend domain
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Use PORT from environment (Railway/Render sets this automatically)
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Archshield API running on port ${port}`);
}
bootstrap();
