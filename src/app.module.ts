import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './auth/endpoints/login/login.module';
import { RefreshModule } from './auth/endpoints/refresh/refresh.module';
import { RegisterModule } from './auth/endpoints/register/register.module';

import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, RegisterModule, LoginModule, RefreshModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
