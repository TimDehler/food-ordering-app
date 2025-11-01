import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor() {}

  @Get('restaurants')
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({
    status: 200,
    description: 'List of all restaurants',
  })
  async getAllRestaurants() {
    // Implementation to get all restaurants
  }
}
