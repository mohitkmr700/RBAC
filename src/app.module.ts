import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [AuthModule,HealthModule], // Import the AuthModule
  controllers: [],
  providers: [],
})
export class AppModule {}
