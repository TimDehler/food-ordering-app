import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshResponseDto } from 'src/auth/endpoints/refresh/dto/refresh-response.dto';
import { RefreshTokenDto } from 'src/auth/endpoints/refresh/dto/refreshToken.dto';
import { RefreshService } from './refresh.service';

@ApiTags('Authentication')
@Controller('auth')
export class RefreshController {
  constructor(private readonly refreshService: RefreshService) {
    this.refreshService = refreshService;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
    type: RefreshResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  @ApiUnauthorizedResponse({ description: 'Refresh token expired or invalid' })
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<RefreshResponseDto> {
    return this.refreshService.refresh(refreshToken);
  }
}
