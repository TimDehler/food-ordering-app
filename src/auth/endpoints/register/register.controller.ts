import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterService } from './register.service';

@ApiTags('Authentication')
@Controller('auth')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {
    this.registerService = registerService;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({ description: 'User already exists' })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.registerService.register(dto);
  }
}
