import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { Injectable, Get, Inject, Controller } from '@nestjs/common';
import {
  CACHE_HEALTH_INDICATOR_TOKEN,
  CacheHealthIndicator,
  DATABASE_HEALTH_INDICATOR_TOKEN,
  DatabaseHealthIndicator,
} from '../../application/healths/health.indicator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,

    @Inject(DATABASE_HEALTH_INDICATOR_TOKEN)
    private databaseHealthIndicator: DatabaseHealthIndicator,

    @Inject(CACHE_HEALTH_INDICATOR_TOKEN)
    private cacheHealthIndicator: CacheHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.databaseHealthIndicator.isHealthy(),
      () => this.cacheHealthIndicator.isHealthy(),
    ]);
  }
}
