// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard'; // <--- Add this

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard], // <--- Provide the guard
  exports: [AuthGuard], // <--- Export it if used in other modules
})
export class AuthModule {}
