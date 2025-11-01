import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserWithoutPassword } from 'dto/types/user-without-password';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: UserWithoutPassword): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload);
    return { accessToken, refreshToken };
  }
}
