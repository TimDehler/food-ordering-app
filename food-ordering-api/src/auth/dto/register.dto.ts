import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe',
    minLength: 3,
  })
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    minLength: 6,
  })
  password: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role?: UserRole;
}
