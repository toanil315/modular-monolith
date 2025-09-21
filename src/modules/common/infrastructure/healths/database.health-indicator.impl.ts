import { Injectable, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  DATABASE_HEALTH_INDICATOR_TOKEN,
  DatabaseHealthIndicator,
} from '../../application/healths/health.indicator';
import { DatabaseConfiguration } from '../database/database-configuration';
import { HealthIndicatorService } from '@nestjs/terminus';

@Injectable()
export class DatabaseHealthIndicatorImpl implements DatabaseHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy() {
    let dataSource: DataSource | null = null;
    const indicator = this.healthIndicatorService.check('database');

    try {
      dataSource = new DataSource(DatabaseConfiguration.get(__dirname));
      await dataSource.initialize();

      await dataSource.query('SELECT 1');

      return indicator.up();
    } catch (error) {
      return indicator.down({ error: error.message });
    } finally {
      await dataSource?.destroy();
    }
  }
}

export const DatabaseHealthIndicatorProvider: Provider = {
  provide: DATABASE_HEALTH_INDICATOR_TOKEN,
  useClass: DatabaseHealthIndicatorImpl,
};
