import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS для работы с внешними клиентами
  app.enableCors();
  
  // Слушаем порт из переменной окружения или 3000 по умолчанию
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on port ${port}`);
}
bootstrap();