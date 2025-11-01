import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'change-this',
      signOptions: {
        expiresIn: `${parseInt(process.env.JWT_EXPIRES_IN ?? '15')}m`,
      },
    }),
  ],
  providers: [LoginService, JwtStrategy, PrismaService],
  controllers: [LoginController],
  exports: [LoginService],
})
export class LoginModule {}
