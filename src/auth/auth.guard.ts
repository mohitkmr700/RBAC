// src/auth/auth.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { AuthService } from './auth.service';
  import { JwtPayload } from 'jsonwebtoken';
  
  interface UserPayload extends JwtPayload {
    id: string;
    email: string;
    role: string;
    full_name: string;
  }
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
      private readonly authService: AuthService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      
      // Try to get token from different sources
      let token = request.cookies['access_token'];
      
      // If no cookie token, try Authorization header (Bearer token)
      if (!token) {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
      }
  
      if (!token) {
        throw new UnauthorizedException('No access token found in cookies or Authorization header');
      }
  
      try {
        // Verify and decode the token
        const decoded = this.authService.verifyToken(token) as UserPayload;
  
        // Get roles from the route handler metadata
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
  
        // If no roles are required, allow access
        if (!requiredRoles) {
          request.user = decoded;
          return true;
        }
  
        // Check if the user's role matches the required role
        if (!requiredRoles.includes(decoded.role)) {
          throw new ForbiddenException('You do not have permission to access this resource');
        }
  
        // If role matches, attach user data to the request
        request.user = decoded;
        return true;
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error;
        }
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  