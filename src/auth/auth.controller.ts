import { Body, Controller, Post, Headers, UnauthorizedException, Res, BadRequestException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Roles } from './auth.decorator';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseGuards(AuthGuard)
  @Roles('punisher')
  @ApiOperation({ summary: 'User signup', description: 'Create a new user account (requires punisher role). Punisher users can create users with any role: punisher, user, or customer.' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and return JWT token with profile data' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
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

    // Return only the success message, profile picture is included in the token
    return {
      message: result.message
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout', description: 'Logout user and clear session' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @ApiResponse({ status: 400, description: 'Bad request - No active session' })
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
