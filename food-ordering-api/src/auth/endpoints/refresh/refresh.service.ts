import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshService {
  constructor(private readonly jwtService: JwtService) {}

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
