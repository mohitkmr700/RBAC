import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const env: number = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env); // Make sure the application listens on port 3000
}
bootstrap();
