import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Define the base route for this controller
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup') // Handle POST requests to /auth/signup
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto); // Pass the signup data to the service
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto); // Pass the entire loginDto object
  }

}
