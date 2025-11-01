import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User, UserRole } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
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

  login(user: UserWithoutPassword): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload);
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const accessToken = this.jwtService.sign({
        sub: payload.sub,
        role: payload.role,
      });
      return { accessToken };
    } catch (_e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
