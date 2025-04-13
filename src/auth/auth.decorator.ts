// src/auth/auth.decorator.ts
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

// Create a custom decorator that sets the roles metadata for the route handler
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// CurrentUser decorator (already defined)
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // This will return the decoded user object (including role)
  }
);
