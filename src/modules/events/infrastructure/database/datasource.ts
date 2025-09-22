import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfiguration } from 'src/modules/common/infrastructure/database/database-configuration';

export const EVENTS_CONNECTION_NAME = 'eventsConnection';
export const EVENTS_SCHEMA = 'events';

const eventsDataSource = new DataSource({
  ...DatabaseConfiguration.get(),
  ...DatabaseConfiguration.getMigrationConfiguration(__dirname),
  schema: EVENTS_SCHEMA,
} as DataSourceOptions);

export default eventsDataSource;
