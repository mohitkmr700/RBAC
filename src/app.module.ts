import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, HealthModule], // Import the AuthModule
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
