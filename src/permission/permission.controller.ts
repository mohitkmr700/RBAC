import { Controller, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, PermissionResponseDto } from './dto/permission.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/auth.decorator';
import { CurrentUser } from '../auth/auth.decorator';

interface UserPayload {
  id: string;
  email: string;
  role: string;
  full_name: string;
  profile_picture: string | null;
}

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permission')
@UseGuards(AuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles('punisher', 'user')
  @ApiOperation({ 
    summary: 'Create permission', 
    description: 'Create a new permission record in PocketBase control_system collection' 
  })
  @ApiQuery({ 
    name: 'email', 
    description: 'Email query parameter (will be overridden by body email)', 
    type: 'string',
    required: false
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Permission created successfully', 
    type: PermissionResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
    @Query('email') queryEmail: string,
    @CurrentUser() user: UserPayload,
  ): Promise<PermissionResponseDto> {
    // Use email from body, but if not provided, use query parameter
    const email = createPermissionDto.email || queryEmail;
    
    if (!email) {
      throw new Error('Email is required either in request body or query parameter');
    }

    // Update the DTO with the email
    const permissionData = {
      ...createPermissionDto,
      email,
    };

    const createdPermission = await this.permissionService.createPermission(permissionData);

    return {
      message: 'Permission created successfully',
      data: createdPermission,
    };
  }
} 