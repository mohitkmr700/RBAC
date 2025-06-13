import { Body, Controller, Post, Headers, UnauthorizedException, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Headers('authorization') authHeader?: string
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token is required');
    }
    const token = authHeader.split(' ')[1];
    return this.authService.signup(dto, token);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.login(loginDto);
    
    // Set the access token in an HTTP-only cookie
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: AuthService.TOKEN_EXPIRY_MS, // Use the constant from AuthService
    });

    // Return only the success message, without the token
    return {
      message: result.message
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // Check if access_token exists in cookies
    const accessToken = response.req.cookies['access_token'];
    
    if (!accessToken) {
      throw new BadRequestException('No active session found');
    }

    // Clear the access token cookie
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return {
      message: 'Successfully logged out'
    };
  }
}
