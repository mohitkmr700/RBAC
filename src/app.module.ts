import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule], // Import the AuthModule
  controllers: [],
  providers: [],
})
export class AppModule {}
