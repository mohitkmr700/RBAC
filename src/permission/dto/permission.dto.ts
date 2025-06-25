import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsObject, IsString, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'User email address',
    example: 'mohit2010sm@gmail.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Modules configuration object',
    example: {
      dashboard: true,
      analytics: false,
      users: true,
      documents: false,
      messages: false,
      settings: false
    }
  })
  @IsObject()
  modules: Record<string, boolean>;

  @ApiProperty({
    description: 'Permissions configuration object',
    example: {
      dashboard: {
        view: true,
        edit: true,
        delete: true,
        export: true,
        import: true
      },
      users: {
        view: true,
        edit: true,
        delete: true,
        export: true,
        import: true
      }
    }
  })
  @IsObject()
  permissions: Record<string, Record<string, boolean>>;

  @ApiProperty({
    description: 'Email of the user who updated the permissions',
    example: 'mohit2010sm@gmail.com'
  })
  @IsEmail()
  updated_by: string;
}

export class PermissionResponseDto {
  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Created permission data' })
  data: any;
} 