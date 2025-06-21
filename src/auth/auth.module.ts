// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard'; // <--- Add this

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard], // <--- Provide the guard
  exports: [AuthService, AuthGuard], // <--- Export both service and guard
})
export class AuthModule {}
