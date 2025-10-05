import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { Get, Inject, Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'nest-keycloak-connect';
import { Result } from '../../domain/result';
import { ApiZodResponse } from '../abstractions/api-zod-response.decorator';
import { GetHealthResponseDto } from './dto';
import {
  DATABASE_HEALTH_INDICATOR_TOKEN,
  DatabaseHealthIndicator,
} from '../../application/healths/database.health-indicator';
import {
  CACHE_HEALTH_INDICATOR_TOKEN,
  CacheHealthIndicator,
} from '../../application/healths/cache.health-indicator';
import {
  AUTH_HEALTH_INDICATOR_TOKEN,
  AuthHealthIndicator,
} from '../../application/healths/auth.health-indicator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,

    @Inject(DATABASE_HEALTH_INDICATOR_TOKEN)
    private databaseHealthIndicator: DatabaseHealthIndicator,

    @Inject(CACHE_HEALTH_INDICATOR_TOKEN)
    private cacheHealthIndicator: CacheHealthIndicator,

    @Inject(AUTH_HEALTH_INDICATOR_TOKEN)
    private authHealthIndicator: AuthHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get Health Check Status',
    description: 'Get health check status',
  })
  @ApiZodResponse({
    description: 'Get Health Check Status Successful',
    type: GetHealthResponseDto,
  })
  async check() {
    try {
      const response = await this.health.check([
        () => this.databaseHealthIndicator.isHealthy(),
        () => this.cacheHealthIndicator.isHealthy(),
        () => this.authHealthIndicator.isHealthy(),
      ]);
      return Result.success(response);
    } catch (error) {
      return Result.success(error.response);
    }
  }
}
