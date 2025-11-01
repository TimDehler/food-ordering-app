import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from 'dto/types/user-without-password';
import { UsersService } from 'src/users/users.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@ApiTags('Authentication')
@Controller('auth')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly usersService: UsersService,
  ) {
    this.loginService = loginService;
    this.usersService = usersService;
  }

  async validateUser(
    email: string,
    plain: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(plain, user.password);
    if (!ok) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.loginService.login(user);
  }
}
