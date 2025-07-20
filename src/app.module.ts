import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { ExpenseModule } from './expense/expense.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, HealthModule, UserModule, PermissionModule, ExpenseModule], // Import the AuthModule
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
