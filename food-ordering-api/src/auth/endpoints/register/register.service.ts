import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const existing = await this.usersService.findByEmail(userData.email);
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashed = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.createUser({
      email: userData.email,
      username: userData.username ?? userData.email,
      password: hashed,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role ?? UserRole.CUSTOMER,
    });

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload);

    return { user, accessToken, refreshToken };
  }
}
