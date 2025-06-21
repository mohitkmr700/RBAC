import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ description: 'Unique identifier for the profile' })
  id: string;

  @ApiProperty({ description: 'Timestamp when the profile was created' })
  created_at: string;

  @ApiProperty({ description: 'Full name of the user' })
  fullname: string;

  @ApiProperty({ description: 'URL to the user avatar', required: false })
  avatar_url?: string;

  @ApiProperty({ description: 'User role (punisher or user)' })
  role: string;

  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'User email address' })
  email: string;
}

export class ProfileListResponseDto {
  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Array of profiles', type: [ProfileDto] })
  data: ProfileDto[];

  @ApiProperty({ description: 'Total number of profiles' })
  total: number;
}

export class ProfileResponseDto {
  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Profile data', type: ProfileDto, required: false })
  data: ProfileDto | null;
} 