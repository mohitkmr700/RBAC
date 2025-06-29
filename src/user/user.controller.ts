import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UserService, Profile } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/auth.decorator';
import { CurrentUser } from '../auth/auth.decorator';
import { ProfileListResponseDto, ProfileResponseDto } from './dto/profile.dto';

interface UserPayload {
  id: string;
  email: string;
  role: string;
  full_name: string;
  profile_picture: string | null;
}

@ApiTags('User Profiles')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profiles')
  @Roles('punisher', 'user')
  @ApiOperation({ summary: 'Get all profiles', description: 'Retrieve all user profiles from the database' })
  @ApiResponse({ status: 200, description: 'Profiles retrieved successfully', type: ProfileListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getAllProfiles(@CurrentUser() user: UserPayload): Promise<ProfileListResponseDto> {
    const profiles = await this.userService.getAllProfiles();
    
    return {
      message: 'Profiles retrieved successfully',
      data: profiles,
      total: profiles.length,
    };
  }

  @Get('profiles/:id')
  @Roles('punisher', 'user')
  @ApiOperation({ summary: 'Get profile by ID', description: 'Retrieve a specific user profile by their ID' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: ProfileResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileById(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ): Promise<ProfileResponseDto> {
    const profile = await this.userService.getProfileById(id);
    
    return {
      message: profile ? 'Profile retrieved successfully' : 'Profile not found',
      data: profile,
    };
  }

  @Get('profiles/role/:role')
  @Roles('punisher')
  @ApiOperation({ summary: 'Get profiles by role', description: 'Retrieve all profiles with a specific role (punisher only)' })
  @ApiParam({ name: 'role', description: 'User role to filter by', type: 'string', enum: ['punisher', 'user'] })
  @ApiResponse({ status: 200, description: 'Profiles retrieved successfully', type: ProfileListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getProfilesByRole(
    @Param('role') role: string,
    @CurrentUser() user: UserPayload,
  ): Promise<ProfileListResponseDto> {
    const profiles = await this.userService.getProfilesByRole(role);
    
    return {
      message: `Profiles with role '${role}' retrieved successfully`,
      data: profiles,
      total: profiles.length,
    };
  }

  @Get('profiles/search')
  @Roles('punisher', 'user')
  @ApiOperation({ summary: 'Search profiles', description: 'Search profiles by name, email, or role' })
  @ApiQuery({ name: 'q', description: 'Search query', type: 'string' })
  @ApiResponse({ status: 200, description: 'Search results', type: ProfileListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async searchProfiles(
    @Query('q') query: string,
    @CurrentUser() user: UserPayload,
  ): Promise<ProfileListResponseDto> {
    // For now, we'll get all profiles and filter in memory
    // In a production app, you'd want to use Supabase's built-in search
    const allProfiles = await this.userService.getAllProfiles();
    
    const filteredProfiles = allProfiles.filter(profile =>
      profile.fullname.toLowerCase().includes(query.toLowerCase()) ||
      profile.email.toLowerCase().includes(query.toLowerCase()) ||
      profile.role.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      message: `Search results for '${query}'`,
      data: filteredProfiles,
      total: filteredProfiles.length,
    };
  }
} 