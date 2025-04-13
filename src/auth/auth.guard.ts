// src/auth/auth.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import * as jwt from 'jsonwebtoken'; // Use JWT for decoding
  import { createClient } from '@supabase/supabase-js';
  
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_SECRET_ROLE_KEY!
  );
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or malformed token');
      }
  
      const token = authHeader.split(' ')[1];
  
      try {
        // Decode the JWT to get the user and role
        const decoded: any = jwt.decode(token);
  
        if (!decoded || !decoded.role) {
          throw new UnauthorizedException('Invalid or expired token');
        }
  
        // Get roles from the route handler metadata
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
  
        // If no roles are required, allow access
        if (!requiredRoles) {
          return true;
        }
  
        // Check if the user's role matches the required role
        if (!requiredRoles.includes(decoded.role)) {
          throw new ForbiddenException('You do not have permission to access this resource');
        }
  
        // If role matches, attach user data to the request
        request['user'] = decoded; // Attach user data, including role
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  