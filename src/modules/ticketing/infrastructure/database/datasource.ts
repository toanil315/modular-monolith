import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfiguration } from 'src/modules/common/infrastructure/database/database-configuration';

export const TICKETING_SCHEMA = 'ticketing';

const ticketingDataSource = new DataSource({
  ...DatabaseConfiguration.get(),
  ...DatabaseConfiguration.getMigrationConfiguration(__dirname),
  schema: TICKETING_SCHEMA,
} as DataSourceOptions);

export default ticketingDataSource;
