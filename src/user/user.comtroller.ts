// src/user/user.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles, CurrentUser } from '../auth/auth.decorator';

@Controller('user')
export class UserController {
  @Get('profile')
  @UseGuards(AuthGuard)
  @Roles('punisher') // Previously 'admin', now aligned to your system
  getProfile(@CurrentUser() user) {
    return {
      message: 'Punisher (admin) profile data',
      user,
    };
  }

  @Get('dashboard')
  @UseGuards(AuthGuard)
  @Roles('punisher') // Assuming only 'punisher' exists, use it here too
  getDashboard(@CurrentUser() user) {
    return {
      message: 'Punisher dashboard data',
      user,
    };
  }
}
