import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfiguration } from 'src/modules/common/infrastructure/database/database-configuration';

export const USERS_CONNECTION_NAME = 'usersConnection';
export const USERS_SCHEMA = 'users';

const usersDataSource = new DataSource({
  ...DatabaseConfiguration.get(),
  ...DatabaseConfiguration.getMigrationConfiguration(__dirname),
  schema: USERS_SCHEMA,
} as DataSourceOptions);

export default usersDataSource;
