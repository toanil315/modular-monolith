import { Injectable, Provider } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfiguration } from '../database/database-configuration';
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';

export interface DatabaseHealthIndicator {
  isHealthy: () => Promise<HealthIndicatorResult>;
}

export const DATABASE_HEALTH_INDICATOR_TOKEN = 'DATABASE_HEALTH_INDICATOR_TOKEN';

@Injectable()
export class DatabaseHealthIndicatorImpl implements DatabaseHealthIndicator {
  constructor(private readonly healthIndicatorService: HealthIndicatorService) {}

  async isHealthy() {
    let dataSource: DataSource | null = null;
    const indicator = this.healthIndicatorService.check('database');

    try {
      dataSource = new DataSource(DatabaseConfiguration.get() as DataSourceOptions);
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
