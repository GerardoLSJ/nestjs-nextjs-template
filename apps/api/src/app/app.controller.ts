import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('health')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns health status of the API',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
      },
    },
  })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @SkipThrottle()
  @ApiOperation({
    summary: 'Get application data',
    description: 'Returns a welcome message from the API',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved application data',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Hello API',
        },
      },
    },
  })
  getData() {
    this.logger.log('GET / endpoint called');
    return this.appService.getData();
  }
}
